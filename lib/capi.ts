import { insforge } from "@/lib/insforge";

type CapiEvent = "Lead" | "Contact" | "ViewContent" | "PageView";

interface CapiUserData {
  em?: string;
  ph?: string;
  external_id?: string;
}

interface CapiCustomData {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}

export async function sendCapiEvent(
  eventName: CapiEvent,
  eventId: string,
  userData?: CapiUserData,
  customData?: CapiCustomData
): Promise<void> {
  try {
    await insforge.functions.invoke("meta-capi", {
      body: {
        event_name: eventName,
        event_id: eventId,
        user_data: userData || {},
        custom_data: customData || {},
      },
    });
  } catch (err) {
    console.error("CAPI error:", err);
  }
}
