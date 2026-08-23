import { MiniLeadForm } from "@/components/mini-lead-form";
import { WaButton } from "@/components/wa-button";
import { TelLink } from "@/components/tel-link";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 pb-14 pt-10 md:pt-16 lg:grid-cols-[1fr_420px] lg:gap-14">
        <div className="reveal">
          <h1 className="max-w-[20ch] text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            Sudah pensiun, masih butuh dana?{" "}
            <span className="text-bni-700">Saya bantu urus sampai cair.</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-stone-700 md:text-xl">
            Gratis konsultasi. Ada pilihan produk dari beberapa bank mitra,
            disesuaikan dengan dana pensiun Bapak/Ibu.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <WaButton size="lg" className="w-full sm:w-auto" />
            <a
              href="#ajukan"
              className="inline-flex min-h-[56px] items-center justify-center rounded-xl border-2 border-navy-200 px-6 text-lg font-semibold text-navy-800 transition-colors hover:border-bni-400 hover:text-bni-700 active:scale-[0.98]"
            >
              Ajukan Sekarang
            </a>
          </div>

          <p className="mt-6 text-base text-stone-600">
            Lebih suka menelepon langsung? <TelLink className="ml-1" />
          </p>
        </div>

        <div className="reveal reveal-d1">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-card-lg md:p-8">
            <h2 className="text-2xl tracking-tight">Mulai dari sini</h2>
            <p className="mb-6 mt-2 text-stone-600">
              Isi dua data ini saja, sisanya saya yang bantu lanjutkan.
            </p>
            <MiniLeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
