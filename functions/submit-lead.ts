import { createClient, createAdminClient } from "npm:@insforge/sdk";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

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
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function (req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Terlalu banyak permintaan. Coba lagi nanti." }),
      {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { name, whatsapp, pension_type, province, loan_amount, interested_bank, utm_source, utm_medium, utm_campaign, utm_content, utm_term } = body;

  if (!name || !whatsapp || !pension_type || !province) {
    return new Response(
      JSON.stringify({ error: "Nama, WhatsApp, jenis pensiun, dan provinsi wajib diisi." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  if (name.length < 3) {
    return new Response(
      JSON.stringify({ error: "Nama minimal 3 karakter." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const phoneRegex = /^(?:\+62|62|0)8\d{7,12}$/;
  const cleanWhatsapp = whatsapp.replace(/[\s\-().]/g, "");
  if (!phoneRegex.test(cleanWhatsapp)) {
    return new Response(
      JSON.stringify({ error: "Format nomor WhatsApp tidak valid." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const client = createAdminClient({
    baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
    apiKey: Deno.env.get("API_KEY"),
  });

  const { data, error } = await client.database
    .from("leads")
    .insert([
      {
        name: name.trim(),
        whatsapp: cleanWhatsapp,
        pension_type,
        province,
        loan_amount: loan_amount || null,
        interested_bank: interested_bank || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
        ip_address: ip,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Database error:", JSON.stringify(error));
    return new Response(
      JSON.stringify({ error: "Gagal menyimpan data.", detail: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ ok: true, id: data.id }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
