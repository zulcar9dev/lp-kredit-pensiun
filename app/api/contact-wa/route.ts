import { NextRequest, NextResponse } from "next/server";
import { getInsforgeAdmin } from "@/lib/insforge";
import { getAppSettings } from "@/lib/settings";
import { WA_NUMBER_INTL } from "@/lib/constants";

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

async function sendContactToMetaCAPI(opts: {
  eventId: string;
  fbp: string | null;
  fbc: string | null;
  ip: string;
  userAgent: string | null;
}): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  try {
    const payload = {
      data: [
        {
          event_name: "Contact",
          event_time: Math.floor(Date.now() / 1000),
          event_id: opts.eventId,
          user_data: {
            fbp: opts.fbp || undefined,
            fbc: opts.fbc || undefined,
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
  async function redirectToWhatsApp(): Promise<NextResponse> {
    const settings = await getAppSettings();
    const waNumber = /^62[0-9]{9,13}$/.test(settings.waNumberIntl)
      ? settings.waNumberIntl
      : WA_NUMBER_INTL;
    const greeting = utm.utm_campaign
      ? `${settings.waGreeting}\n\n(Dikirim dari halaman web — kampanye: ${utm.utm_campaign})`
      : settings.waGreeting;
    return NextResponse.redirect(
      new URL(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(greeting)}`,
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

  // 2. CAPI "Contact" server-side (dedup dengan Pixel via event_id)
  await sendContactToMetaCAPI({ eventId: eid, fbp, fbc, ip, userAgent });

  // 3. Redirect ke WhatsApp
  return redirectToWhatsApp();
}
