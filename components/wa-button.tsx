"use client";

import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { MouseEvent } from "react";
import { trackPixel, generateEventId } from "@/lib/pixel";
import { readFbpCookie, readStoredFbc, readStoredUtm } from "@/lib/utm";
import { buildContactWaUrl } from "@/lib/wa";
import { CTA_LABEL } from "@/lib/constants";

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
    trackPixel("Contact", { content_name: "Kredit Pensiun" }, { eventID: eid });

    window.location.href = buildContactWaUrl({
      eid,
      utm: readStoredUtm(),
      fbc: readStoredFbc(),
      leadRef: leadRef ?? null,
    });
  }

  return (
    <a
      href={waLink}
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
