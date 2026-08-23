import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { FAQS } from "@/lib/constants";

export function Faq() {
  return (
    <section id="faq" className="bg-white">
      <div className="container-page max-w-3xl py-16 md:py-24">
        <h2 className="text-3xl tracking-tight sm:text-4xl">
          Pertanyaan yang sering ditanyakan
        </h2>

        <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold text-navy-900 transition-colors hover:text-bni-700 [&::-webkit-details-marker]:hidden">
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
          Masih ada pertanyaan lain?{" "}
          <a
            href="#ajukan"
            className="font-semibold text-bni-700 underline decoration-bni-300 decoration-2 underline-offset-4 transition-colors hover:text-bni-800"
          >
            Hubungi kami di sini.
          </a>
        </p>
      </div>
    </section>
  );
}
