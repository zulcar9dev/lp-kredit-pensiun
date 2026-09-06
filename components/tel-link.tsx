import { Phone } from "@phosphor-icons/react/dist/ssr";
import { WA_NUMBER_DISPLAY } from "@/lib/constants";

export function TelLink({
  number,
  className = "",
}: {
  number?: string;
  className?: string;
}) {
  const display = number || WA_NUMBER_DISPLAY;
  const clean = display.replace(/[^0-9]/g, "");
  const tel = clean.startsWith("0") ? `+62${clean.slice(1)}` : `+62${clean}`;

  return (
    <a
      href={`tel:${tel}`}
      className={`inline-flex items-center gap-2 font-semibold text-navy-800 underline decoration-bni-300 decoration-2 underline-offset-4 transition-colors hover:text-bni-700 ${className}`}
    >
      <Phone weight="bold" className="size-5 shrink-0" aria-hidden="true" />
      <span>{display}</span>
    </a>
  );
}
