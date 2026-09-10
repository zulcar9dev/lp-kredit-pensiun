import { createAdminClient } from "npm:@insforge/sdk";
import { z } from "npm:zod";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// PRD §5: DB menyimpan snake_case. Terima label lama ("TNI/Polri") dari
// klien lawas dan petakan ke snake_case sebelum validasi + insert.
const PENSION_TYPES_DB = ["tni_polri", "pns", "bumn", "swasta"];
const PENSION_LABEL_TO_DB: Record<string, string> = {
  "TNI/Polri": "tni_polri",
  PNS: "pns",
  BUMN: "bumn",
  Swasta: "swasta",
};

const APPLICANT_RELATIONS = ["sendiri", "orang_tua"] as const;

const LOAN_MIN = 10_000_000;
const LOAN_MAX = 500_000_000;

// PRD §8.2 — MIRROR dari lib/schema.ts (leadDbSchema). Edge Deno tidak bisa
// impor relatif Next.js, jadi skema diduplikat di sini via npm:zod.
// ATURAN SINKRON (ubah keduanya bila mengganti): nama 3–100, phone regex
// /^(?:\+62|62|0)8\d{7,12}$/ + strip spasi-strip-titik-kurung, pension label
// lama diterima lalu dipetakan ke snake, relasi default "sendiri",
// loan int 10jt–500jt opsional, consent wajib true.
const phoneField = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .refine((v) => /^(?:\+62|62|0)8\d{7,12}$/.test(v), {
    message: "Nomornya pakai format Indonesia ya, contoh: 081234567890",
  });

const edgeLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Mohon isi nama lengkapnya, minimal 3 huruf.")
    .max(100, "Namanya terlalu panjang."),
  whatsapp: phoneField,
  pension_type: z
    .string()
    .transform((v) => PENSION_LABEL_TO_DB[v] ?? v)
    .pipe(
      z.enum(PENSION_TYPES_DB as [string, ...string[]], {
        message: "Jenis pensiun tidak valid.",
      }),
    ),
  applicant_relation: z.enum(APPLICANT_RELATIONS).catch("sendiri"),
  loan_amount: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (v === undefined || v === null || v === "") return null;
      const n = Number(v);
      return Number.isInteger(n) ? n : NaN;
    })
    .pipe(
      z
        .number()
        .int()
        .min(LOAN_MIN, "Nominal minimal Rp 10 juta.")
        .max(LOAN_MAX, "Nominal maksimal Rp 500 juta.")
        .nullable(),
    ),
  consent: z.literal(true, {
    message: "Mohon centang persetujuan pemrosesan data terlebih dulu.",
  }),
});

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  return crypto.subtle
    .digest("SHA-256", msgBuffer)
    .then((hashBuffer) =>
      Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
}

// Normalisasi ke E.164 tanpa tanda plus: 62xxxxxxxxxx (disimpan ke DB apa adanya)
function toE164Digits(raw: string): string {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+62")) return cleaned.slice(1);
  if (cleaned.startsWith("62")) return cleaned;
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  return cleaned;
}

async function sendLeadToMetaCAPI(opts: {
  eventId: string;
  phoneE164: string;
  firstName: string;
  fbp: string | null;
  fbc: string | null;
  ip: string;
  userAgent: string | null;
  pensionType?: string | null;
  applicantRelation?: string | null;
  utm?: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
  };
}): Promise<void> {
  const pixelId = Deno.env.get("META_PIXEL_ID");
  const accessToken = Deno.env.get("META_ACCESS_TOKEN");
  if (!pixelId || !accessToken) {
    console.warn("CAPI skipped: META_PIXEL_ID / META_ACCESS_TOKEN not set");
    return;
  }

  try {
    const [ph, fn] = await Promise.all([
      sha256Hex(opts.phoneE164.trim().toLowerCase()),
      // PRD §4.1: nama lengkap (lowercase + trim) lalu SHA-256
      sha256Hex(opts.firstName.trim().toLowerCase().replace(/\s+/g, " ")),
    ]);
    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: opts.eventId,
          user_data: {
            ph,
            fn,
            fbp: opts.fbp || undefined,
            fbc: opts.fbc || undefined,
            client_ip_address: opts.ip || undefined,
            client_user_agent: opts.userAgent || undefined,
          },
          custom_data: {
            content_name: "Landing Page Kredit Pensiun",
            pension_type: opts.pensionType || undefined,
            applicant_relation: opts.applicantRelation || undefined,
            utm_source: opts.utm?.utm_source || undefined,
            utm_medium: opts.utm?.utm_medium || undefined,
            utm_campaign: opts.utm?.utm_campaign || undefined,
            utm_content: opts.utm?.utm_content || undefined,
            utm_term: opts.utm?.utm_term || undefined,
          },
          action_source: "website",
        },
      ],
    };

    const resp = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      console.error("Meta CAPI error:", resp.status, await resp.text());
    }
  } catch (err) {
    console.error("Meta CAPI failed:", err);
  }
}

export default async function (req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent");

  // Lapis 1: in-memory (murah, cepat)
  if (!checkRateLimit(ip)) {
    return json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, 429);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const {
    name, whatsapp, pension_type, applicant_relation, loan_amount, consent,
    event_id, fbp, fbc,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    website,
  } = body;

  // Honeypot: field "website" tak terlihat manusia. Terisi → bot.
  // Respons sukses palsu agar bot tidak mencoba lagi, tanpa insert & tanpa CAPI.
  if (typeof website === "string" && website.trim() !== "") {
    return json({ ok: true, event_id: null, duplicate: false }, 200);
  }

  // PRD §8.2 (best practice: safeParse + early return)
  const validated = edgeLeadSchema.safeParse({
    name,
    whatsapp,
    pension_type,
    applicant_relation,
    loan_amount,
    consent,
  });
  if (!validated.success) {
    return json(
      { error: validated.error.issues[0]?.message ?? "Data tidak valid." },
      400,
    );
  }
  const trimmedName = validated.data.name;
  const cleanWhatsapp = validated.data.whatsapp;
  const pensionDb = validated.data.pension_type;
  const relation = validated.data.applicant_relation;
  const loanAmount = validated.data.loan_amount;

  const shortText = (v: unknown, max: number): string | null => {
    if (typeof v !== "string" || v.trim() === "") return null;
    return v.trim().slice(0, max);
  };

  // event_id dari klien untuk dedup Pixel ↔ CAPI; fallback bila tidak ada
  const clientEventId =
    typeof event_id === "string" && event_id.trim() !== ""
      ? event_id.trim().slice(0, 100)
      : null;

  const whatsappE164 = toE164Digits(cleanWhatsapp);

  const client = createAdminClient({
    baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
    apiKey: Deno.env.get("API_KEY"),
  });

  // Lapis 2: berbasis DB — tahan terhadap cold start & banyak instance
  const hourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count } = await client.database
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", hourAgo);

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, 429);
  }

  // Anti double-submit: nomor sama dalam 24 jam → respons tetap sukses tanpa baris baru
  const dayAgo = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { data: existing } = await client.database
    .from("leads")
    .select("id, event_id")
    .eq("whatsapp", whatsappE164)
    .is("deleted_at", null)
    .gte("created_at", dayAgo)
    .order("created_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) {
    const dup = existing[0] as { id: string; event_id: string | null };
    return json(
      {
        ok: true,
        id: dup.id,
        event_id: dup.event_id ?? clientEventId ?? `lead-${dup.id}`,
        duplicate: true,
      },
      200,
    );
  }

  const { data, error } = await client.database
    .from("leads")
    .insert([
      {
        name: trimmedName,
        whatsapp: whatsappE164,
        pension_type: pensionDb,
        applicant_relation: relation,
        loan_amount: loanAmount,
        consent: true,
        consent_at: new Date().toISOString(),
        event_id: clientEventId,
        fbp: shortText(fbp, 200),
        fbc: shortText(fbc, 200),
        utm_source: shortText(utm_source, 100),
        utm_medium: shortText(utm_medium, 100),
        utm_campaign: shortText(utm_campaign, 200),
        utm_content: shortText(utm_content, 200),
        utm_term: shortText(utm_term, 200),
        ip_address: ip,
        user_agent: userAgent ? userAgent.slice(0, 500) : null,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Database error:", JSON.stringify(error));
    return json(
      { error: "Gagal menyimpan data.", detail: error.message },
      500
    );
  }

  const eventId = clientEventId ?? `lead-${data.id}`;
  await sendLeadToMetaCAPI({
    eventId,
    phoneE164: whatsappE164,
    firstName: trimmedName,
    fbp: shortText(fbp, 200),
    fbc: shortText(fbc, 200),
    ip,
    userAgent,
    pensionType: pensionDb,
    applicantRelation: relation,
    utm: {
      utm_source: shortText(utm_source, 100),
      utm_medium: shortText(utm_medium, 100),
      utm_campaign: shortText(utm_campaign, 200),
      utm_content: shortText(utm_content, 200),
      utm_term: shortText(utm_term, 200),
    },
  });

  return json({ ok: true, id: data.id, event_id: eventId }, 200);
}
