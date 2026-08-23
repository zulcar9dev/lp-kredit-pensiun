"use client";

import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { buildWaLink } from "@/lib/wa";
import { trackPixel } from "@/lib/pixel";
import { CTA_LABEL } from "@/lib/constants";

interface WaButtonProps {
  label?: string;
  size?: "md" | "lg";
  message?: string;
  className?: string;
}

export function WaButton({
  label = CTA_LABEL,
  size = "md",
  message,
  className = "",
}: WaButtonProps) {
  const sizeClass =
    size === "lg"
      ? "min-h-[56px] px-7 py-4 text-lg"
      : "min-h-[48px] px-5 py-3 text-base";

  return (
    <a
      href={buildWaLink({ message })}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPixel("Contact", { content_name: "Kredit Pensiun" })}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl bg-wa font-semibold text-navy-900 shadow-card transition-colors hover:bg-wa-hover active:scale-[0.98] ${sizeClass} ${className}`}
    >
      <WhatsappLogo weight="fill" className="size-6 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
