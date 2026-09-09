"use client";

import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { MouseEvent } from "react";
import { trackPixel, generateEventId } from "@/lib/pixel";
import { readFbpCookie, readStoredFbc, readStoredUtm } from "@/lib/utm";
import { buildContactWaUrl, CONTACT_WA_PATH } from "@/lib/wa";
import { CTA_LABEL, PIXEL_CONTENT_NAME } from "@/lib/constants";

interface WaButtonProps {
  waLink: string;
  leadRef?: string | null;
  label?: string;
  size?: "md" | "lg";
  className?: string;
}

export function WaButton({
  waLink,
  leadRef,
  label = CTA_LABEL,
  size = "md",
  className = "",
}: WaButtonProps) {
  const sizeClass =
    size === "lg"
      ? "min-h-[56px] px-7 py-4 text-lg"
      : "min-h-[48px] px-5 py-3 text-base";

  // Klik CTA tidak langsung ke wa.me, melalui /api/contact-wa untuk
  // tracking CAPI "Contact" server-side (dedup dengan Pixel via eventID).
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Middle-click / ctrl-click / klik kanan: biarkan href fallback bekerja
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();

    const eid = generateEventId();
    trackPixel("Contact", { content_name: PIXEL_CONTENT_NAME }, { eventID: eid });

    window.location.href = buildContactWaUrl({
      eid,
      utm: readStoredUtm(),
      fbc: readStoredFbc(),
      leadRef: leadRef ?? null,
    });
  }

  // PRD §3.2/§4.1: SEMUA klik melalui /api/contact-wa (bukan wa.me langsung)
  // agar tercatat di CAPI + wa_clicks. href fallback pun mengarah ke route
  // internal — server membuatkan event_id bila JS nonaktif. waLink (wa.me)
  // tidak lagi dipakai sebagai href.
  void waLink;
  const fallbackHref =
    leadRef != null && leadRef !== ""
      ? `${CONTACT_WA_PATH}?lead=${encodeURIComponent(leadRef)}`
      : CONTACT_WA_PATH;

  return (
    <a
      href={fallbackHref}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl bg-wa font-semibold text-navy-900 shadow-card transition-colors hover:bg-wa-hover active:scale-[0.98] ${sizeClass} ${className}`}
    >
      <WhatsappLogo weight="fill" className="size-6 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

// Ekspor kecil agar fbp tersedia bila dibutuhkan komponen lain (tidak wajib)
export { readFbpCookie };
