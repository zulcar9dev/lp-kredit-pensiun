import { HeroEstimator } from "@/components/hero-estimator";
import { WaButton } from "@/components/wa-button";
import { TelLink } from "@/components/tel-link";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 pb-14 pt-10 md:pt-16 lg:grid-cols-[1fr_420px] lg:gap-14">
        <div className="reveal">
          <h1 className="max-w-[20ch] text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            Sudah pensiun dan masih ada rencana?{" "}
            <span className="text-bni-700">
              Tinggal chat, saya urus sampai cair.
            </span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-stone-700 md:text-xl">
            Konsultasi gratis. Saya carikan produk dari beberapa bank mitra
            yang pas dengan dana pensiun Bapak/Ibu.
          </p>

          <div className="mt-8">
            <WaButton size="lg" className="w-full sm:w-auto" />
          </div>

          <p className="mt-6 text-base text-stone-600">
            Lebih suka menelepon langsung? <TelLink className="ml-1" />
          </p>
        </div>

        <div className="reveal reveal-d1">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-card-lg md:p-8">
            <h2 className="text-2xl tracking-tight">
              Hitung sendiri plafon Bapak/Ibu
            </h2>
            <p className="mb-6 mt-2 text-stone-600">
              Geser angka pendapatan, isi tanggal lahir, hasilnya langsung
              keluar. Tanpa data pribadi.
            </p>
            <HeroEstimator />
          </div>
        </div>
      </div>
    </section>
  );
}
