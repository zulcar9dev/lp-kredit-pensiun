import { ArrowRight, Calculator } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function SimulationTeaser() {
  return (
    <section aria-labelledby="simulasi-teaser-title" className="bg-stone-50">
      <div className="container-page pb-16 md:pb-24">
        <div className="reveal flex flex-col gap-6 rounded-xl border border-stone-200 bg-white p-7 shadow-card md:flex-row md:items-center md:justify-between md:p-9">
          <div className="flex items-start gap-5">
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white"
            >
              <Calculator weight="duotone" className="size-7" />
            </span>
            <div>
              <h2 id="simulasi-teaser-title" className="text-2xl tracking-tight sm:text-3xl">
                Mau hitungan yang lebih rinci?
              </h2>
              <p className="mt-2 max-w-[52ch] text-stone-700">
                Di halaman simulasi, Bapak/Ibu bisa atur sendiri lama
                pinjamannya, lengkap dengan rincian biaya dan perkiraan dana
                bersih yang diterima.
              </p>
            </div>
          </div>
          <Link
            href="/simulasi"
            className="inline-flex min-h-[56px] shrink-0 items-center justify-center gap-2 rounded-xl bg-bni-600 px-7 text-lg font-bold text-white shadow-card transition-colors hover:bg-bni-700 active:scale-[0.99]"
          >
            <span>Buka Simulasi Lengkap</span>
            <ArrowRight weight="bold" className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
