import {
  ArrowRight,
  ChatsCircle,
  HandCoins,
  MagnifyingGlass,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { STEPS } from "@/lib/constants";

const STEP_ICONS = [WhatsappLogo, MagnifyingGlass, HandCoins] as const;
const FALLBACK_ICON = ChatsCircle;

export function HowItWorks() {
  return (
    <section id="cara-pengajuan" className="bg-stone-50">
      <div className="container-page py-16 md:py-24">
        <h2 className="max-w-[26ch] text-3xl tracking-tight sm:text-4xl">
          Cara pengajuannya gampang, cuma tiga langkah.
        </h2>
        <p className="mt-4 max-w-[56ch] text-stone-700">
          Untuk memulai, Bapak/Ibu tidak perlu ke mana-mana.
        </p>

        <ol className="mt-12 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-3">
          {STEPS.map((step, index) => (
            <li key={step.label} className="contents" aria-label={step.label}>
              <article className="flex h-full flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-card md:p-7">
                <span
                  aria-hidden="true"
                  className="mb-5 flex size-14 items-center justify-center rounded-xl bg-navy-900 text-white"
                >
                  {(() => {
                    const Icon = STEP_ICONS[index] ?? FALLBACK_ICON;
                    return <Icon weight="duotone" className="size-7" />;
                  })()}
                </span>
                <h3 className="text-lg font-extrabold tracking-tight text-brand-700">
                  {step.label}
                </h3>
                <p className="mt-1.5 text-lg font-bold text-navy-900">
                  {step.title}
                </p>
                <p className="mt-2 text-base leading-relaxed text-stone-700">
                  {step.description}
                </p>
              </article>

              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center py-1 md:py-0"
                >
                  <ArrowRight
                    weight="bold"
                    className="size-6 rotate-90 text-brand-400 md:rotate-0"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-[56ch] text-sm text-stone-600">
          Soal lama proses dan berkas yang perlu disiapkan, semuanya
          dijelaskan saat konsultasi sesuai kondisi Bapak/Ibu.
        </p>
      </div>
    </section>
  );
}
