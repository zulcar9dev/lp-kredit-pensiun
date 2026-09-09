import { createAdminClient } from "npm:@insforge/sdk";

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
const PENSION_TYPES = PENSION_TYPES_DB;
const APPLICANT_RELATIONS = ["sendiri", "orang_tua"];

const LOAN_MIN = 10_000_000;
const LOAN_MAX = 500_000_000;

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

  // UU PDP: persetujuan wajib sebelum data diproses
  if (consent !== true) {
    return json(
      { error: "Mohon centang persetujuan pemrosesan data terlebih dulu." },
      400,
    );
  }

  // Validasi wajib + tipe
  if (
    typeof name !== "string" ||
    typeof whatsapp !== "string" ||
    typeof pension_type !== "string"
  ) {
    return json({ error: "Nama, WhatsApp, dan jenis pensiun wajib diisi." }, 400);
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return json({ error: "Nama minimal 3 karakter." }, 400);
  }

  const phoneRegex = /^(?:\+62|62|0)8\d{7,12}$/;
  const cleanWhatsapp = whatsapp.replace(/[\s\-().]/g, "");
  if (!phoneRegex.test(cleanWhatsapp)) {
    return json({ error: "Format nomor WhatsApp tidak valid." }, 400);
  }

  const pensionDb =
    PENSION_LABEL_TO_DB[pension_type] ??
    (PENSION_TYPES.includes(pension_type) ? pension_type : null);
  if (!pensionDb) {
    return json({ error: "Jenis pensiun tidak valid." }, 400);
  }

  const relation =
    typeof applicant_relation === "string" &&
    APPLICANT_RELATIONS.includes(applicant_relation)
      ? applicant_relation
      : "sendiri";

  let loanAmount: number | null = null;
  if (loan_amount !== undefined && loan_amount !== null && loan_amount !== "") {
    const parsed = Number(loan_amount);
    if (!Number.isInteger(parsed) || parsed < LOAN_MIN || parsed > LOAN_MAX) {
      return json({ error: "Nominal pinjaman di luar batas yang diizinkan." }, 400);
    }
    loanAmount = parsed;
  }

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
