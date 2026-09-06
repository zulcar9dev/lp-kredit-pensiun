import { createAdminClient } from "npm:@insforge/sdk";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const PENSION_TYPES = ["TNI/Polri", "PNS", "BUMN", "Swasta"];

const PROVINCES = [
  "Aceh", "Bali", "Bangka Belitung", "Banten", "Bengkulu", "DI Yogyakarta",
  "DKI Jakarta", "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah",
  "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah",
  "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Riau", "Lampung",
  "Maluku", "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Papua", "Papua Barat", "Papua Barat Daya", "Papua Pegunungan",
  "Papua Selatan", "Papua Tengah", "Riau", "Sulawesi Barat",
  "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara",
  "Sumatra Barat", "Sumatra Selatan", "Sumatra Utara",
];

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

// Normalisasi ke format internasional tanpa tanda plus: 62xxxxxxxxxx
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
  ip: string;
  userAgent: string | null;
}): Promise<void> {
  const pixelId = Deno.env.get("META_PIXEL_ID");
  const accessToken = Deno.env.get("META_ACCESS_TOKEN");
  if (!pixelId || !accessToken) {
    console.warn("CAPI skipped: META_PIXEL_ID / META_ACCESS_TOKEN not set");
    return;
  }

  try {
    const ph = await sha256Hex(opts.phoneE164.trim().toLowerCase());
    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: opts.eventId,
          user_data: {
            ph,
            client_ip_address: opts.ip || undefined,
            client_user_agent: opts.userAgent || undefined,
          },
          custom_data: { content_name: "Kredit Pensiun" },
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
    name, whatsapp, pension_type, province, loan_amount, interested_bank,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  } = body;

  // Validasi wajib + tipe
  if (
    typeof name !== "string" ||
    typeof whatsapp !== "string" ||
    typeof pension_type !== "string" ||
    typeof province !== "string"
  ) {
    return json({ error: "Nama, WhatsApp, jenis pensiun, dan provinsi wajib diisi." }, 400);
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

  if (!PENSION_TYPES.includes(pension_type)) {
    return json({ error: "Jenis pensiun tidak valid." }, 400);
  }

  if (!PROVINCES.includes(province)) {
    return json({ error: "Provinsi tidak valid." }, 400);
  }

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

  const { data, error } = await client.database
    .from("leads")
    .insert([
      {
        name: trimmedName,
        whatsapp: cleanWhatsapp,
        pension_type,
        province,
        loan_amount: loanAmount,
        interested_bank: shortText(interested_bank, 100),
        utm_source: shortText(utm_source, 100),
        utm_medium: shortText(utm_medium, 100),
        utm_campaign: shortText(utm_campaign, 200),
        utm_content: shortText(utm_content, 200),
        utm_term: shortText(utm_term, 200),
        ip_address: ip,
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

  const eventId = `lead-${data.id}`;
  await sendLeadToMetaCAPI({
    eventId,
    phoneE164: toE164Digits(cleanWhatsapp),
    ip,
    userAgent,
  });

  return json({ ok: true, id: data.id, event_id: eventId }, 200);
}
