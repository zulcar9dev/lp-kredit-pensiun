const META_CAPI_URL = "https://graph.facebook.com/v19.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { event_name, event_id, user_data, custom_data } = await req.json();

    const pixelId = Deno.env.get("META_PIXEL_ID");
    const accessToken = Deno.env.get("META_ACCESS_TOKEN");

    if (!pixelId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing META_PIXEL_ID or META_ACCESS_TOKEN" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hashedUserData = { ...user_data };
    if (hashedUserData.ph) {
      hashedUserData.ph = await sha256(hashedUserData.ph);
    }
    if (hashedUserData.em) {
      hashedUserData.em = await sha256(hashedUserData.em);
    }

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          user_data: {
            ...hashedUserData,
            client_ip_address: req.headers.get("x-forwarded-for") || undefined,
            client_user_agent: req.headers.get("user-agent") || undefined,
          },
          custom_data: custom_data || {},
          action_source: "website",
        },
      ],
    };

    const url = `${META_CAPI_URL}/${pixelId}/events?access_token=${accessToken}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await resp.json();

    return new Response(JSON.stringify(result), {
      status: resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
