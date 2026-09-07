type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID ?? "";

export type PixelEvent = "PageView" | "ViewContent" | "Lead" | "Contact";

interface TrackOptions {
  eventID?: string;
}

export function trackPixel(
  event: PixelEvent,
  params?: Record<string, unknown>,
  options?: TrackOptions,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (options?.eventID) {
    // eventID dipakai Meta untuk dedup antara Pixel (klien) dan CAPI (server)
    window.fbq("track", event, params, { eventID: options.eventID });
    return;
  }
  window.fbq("track", event, params);
}

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `lp-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
