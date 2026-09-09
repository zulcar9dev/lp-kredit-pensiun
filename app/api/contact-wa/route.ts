import { NextRequest, NextResponse } from "next/server";
import { getInsforgeAdmin } from "@/lib/insforge";
import { getAppSettings } from "@/lib/settings";
import { WA_NUMBER_INTL, WA_PREFILLED_MESSAGE } from "@/lib/constants";

// PRD §4.1: rate limit endpoint redirect 30 / IP / jam (anti spam klik yang
// membakar event CAPI). In-memory cukup untuk satu instance deployment.
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function shortText(v: string | null, max: number): string | null {
  if (!v || v.trim() === "") return null;
  return v.trim().slice(0, max);
}

async function sha256Hex(message: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(message),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendContactToMetaCAPI(opts: {
  eventId: string;
  fbp: string | null;
  fbc: string | null;
  ip: string;
  userAgent: string | null;
  // PRD §4.2: phone (hash, jika ada) + UTM untuk atribusi kampanye
  phoneE164?: string | null;
  utm?: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
  };
}): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  try {
    // PRD §4.1: phone → E.164 tanpa "+" lalu SHA-256
    const ph = opts.phoneE164
      ? await sha256Hex(opts.phoneE164.trim().toLowerCase())
      : undefined;
    const payload = {
      data: [
        {
          event_name: "Contact",
          event_time: Math.floor(Date.now() / 1000),
          event_id: opts.eventId,
          user_data: {
            ph,
            fbp: opts.fbp || undefined,
            fbc: opts.fbc || undefined,
            client_ip_address: opts.ip || undefined,
            client_user_agent: opts.userAgent || undefined,
          },
          custom_data: {
            content_name: "Landing Page Kredit Pensiun",
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
        // PRD §4.1 fail-safe: jangan biarkan Meta yang lambat menahan redirect
        signal: AbortSignal.timeout(3000),
      },
    );
    if (!resp.ok) {
      console.error("Meta CAPI Contact error:", resp.status, await resp.text());
    }
  } catch (err) {
    // Fail-safe: kegagalan CAPI tidak boleh menghalangi redirect
    console.error("Meta CAPI Contact failed:", err);
  }
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent");

  const params = req.nextUrl.searchParams;
  const eid = shortText(params.get("eid"), 100) ?? crypto.randomUUID();
  const fbp = req.cookies.get("_fbp")?.value ?? null;
  const fbc = shortText(params.get("fbc"), 200);
  const leadParam = params.get("lead");
  const leadRef =
    leadParam && UUID_REGEX.test(leadParam) ? leadParam : null;

  const utm = {
    utm_source: shortText(params.get("utm_source"), 100),
    utm_medium: shortText(params.get("utm_medium"), 100),
    utm_campaign: shortText(params.get("utm_campaign"), 200),
    utm_content: shortText(params.get("utm_content"), 200),
    utm_term: shortText(params.get("utm_term"), 200),
  };

  // Selalu redirect (fail-safe) — tracking dilakukan best-effort.
  // BACKEND-7: getAppSettings() bisa throw (DB ngadat) — tangkap agar
  // respons tetap 302 ke nomor fallback, bukan 500.
  async function redirectToWhatsApp(): Promise<NextResponse> {
    let waNumber = WA_NUMBER_INTL;
    let greeting = WA_PREFILLED_MESSAGE;
    try {
      const settings = await getAppSettings();
      if (/^62[0-9]{9,13}$/.test(settings.waNumberIntl)) {
        waNumber = settings.waNumberIntl;
      }
      greeting = settings.waGreeting;
    } catch (err) {
      console.error("contact-wa settings failed, pakai fallback:", err);
    }
    const text = utm.utm_campaign
      ? `${greeting}\n\n(Dikirim dari halaman web — kampanye: ${utm.utm_campaign})`
      : greeting;
    return NextResponse.redirect(
      new URL(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
      ),
      302,
    );
  }

  // Rate limit melebihi batas → tetap arahkan ke WhatsApp tanpa tracking.
  if (!checkRateLimit(ip)) {
    return redirectToWhatsApp();
  }

  // 1. Log klik ke wa_clicks (audit Click-WA Rate per kampanye)
  try {
    await getInsforgeAdmin().database.from("wa_clicks").insert([
      {
        event_id: eid,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term,
        fbp,
        fbc,
        lead_id: leadRef,
        ip_address: ip,
        user_agent: userAgent ? userAgent.slice(0, 500) : null,
      },
    ]);
  } catch (err) {
    console.error("wa_clicks insert failed:", err);
  }

  // 2. CAPI "Contact" server-side (dedup dengan Pixel via event_id).
  // Jika klik berasal dari success-state (leadRef), ambil nomor lead untuk
  // Advanced Matching (ph hash). Best-effort: gagal lookup tetap kirim event.
  let phoneE164: string | null = null;
  if (leadRef) {
    try {
      const { data } = await getInsforgeAdmin()
        .database.from("leads")
        .select("whatsapp")
        .eq("id", leadRef)
        .is("deleted_at", null)
        .limit(1)
        .single();
      const w = (data as { whatsapp?: string } | null)?.whatsapp;
      if (typeof w === "string" && w.trim() !== "") phoneE164 = w.trim();
    } catch {
      // abaikan — event tetap dikirim tanpa ph
    }
  }
  // BACKEND-6: CAPI dikirim fire-and-forget (tidak di-await) agar Meta
  // yang lambat tidak menahan redirect 302. Error sudah ditangani di dalam.
  void sendContactToMetaCAPI({
    eventId: eid,
    fbp,
    fbc,
    ip,
    userAgent,
    phoneE164,
    utm,
  });

  // 3. Redirect ke WhatsApp
  return redirectToWhatsApp();
}
