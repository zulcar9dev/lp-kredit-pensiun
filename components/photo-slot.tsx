import { ImageSquare } from "@phosphor-icons/react/dist/ssr";

interface PhotoSlotProps {
  label: string;
  ratio?: "aspect-[4/3]" | "aspect-square" | "aspect-video";
  className?: string;
}

export function PhotoSlot({
  label,
  ratio = "aspect-[4/3]",
  className = "",
}: PhotoSlotProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-bni-200 bg-gradient-to-br from-bni-50 via-stone-50 to-navy-50 p-6 text-center ${ratio} ${className}`}
    >
      <ImageSquare
        className="size-8 shrink-0 text-bni-300"
        aria-hidden="true"
      />
      <p className="max-w-[26ch] text-sm font-medium text-stone-500">{label}</p>
    </div>
  );
}
