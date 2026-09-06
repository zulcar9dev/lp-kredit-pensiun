import { WarningCircle } from "@phosphor-icons/react/dist/ssr";

export const labelClass = "block text-sm font-bold text-navy-900";

export const inputClass =
  "min-h-[52px] w-full rounded-xl border border-stone-300 bg-white px-4 text-navy-900 placeholder:text-stone-500 transition-colors focus:border-brand-600 md:text-lg";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-red-700"
    >
      <WarningCircle
        weight="fill"
        className="mt-0.5 size-4 shrink-0"
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  );
}
