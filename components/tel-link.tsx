import { Phone } from "@phosphor-icons/react/dist/ssr";
import { WA_NUMBER_DISPLAY } from "@/lib/constants";

export function TelLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={`tel:+62${WA_NUMBER_DISPLAY.replace(/[^0-9]/g, "").slice(2)}`}
      className={`inline-flex items-center gap-2 font-semibold text-navy-800 underline decoration-bni-300 decoration-2 underline-offset-4 transition-colors hover:text-bni-700 ${className}`}
    >
      <Phone weight="bold" className="size-5 shrink-0" aria-hidden="true" />
      <span>{WA_NUMBER_DISPLAY}</span>
    </a>
  );
}
