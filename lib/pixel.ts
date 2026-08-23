type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID ?? "";

export type PixelEvent = "PageView" | "ViewContent" | "Lead" | "Contact";

export function trackPixel(
  event: PixelEvent,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
