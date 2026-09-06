import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { Faq } from "@/lib/types/database";

export function Faq({ items }: { items: Faq[] }) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="bg-white">
      <div className="container-page max-w-3xl py-16 md:py-24">
        <h2 className="text-3xl tracking-tight sm:text-4xl">
          Pertanyaan yang sering ditanyakan
        </h2>

        <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
          {items.map((faq) => (
            <details key={faq.id} className="group">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold text-navy-900 transition-colors hover:text-brand-700 [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <CaretDown
                  weight="bold"
                  aria-hidden="true"
                  className="size-5 shrink-0 text-stone-500 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="max-w-[68ch] pb-6 leading-relaxed text-stone-700">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-stone-700">
          Masih ada yang ingin ditanyakan?{" "}
          <a
            href="#ajukan"
            className="font-semibold text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-4 transition-colors hover:text-brand-800"
          >
            Sampaikan saja lewat sini.
          </a>
        </p>
      </div>
    </section>
  );
}
