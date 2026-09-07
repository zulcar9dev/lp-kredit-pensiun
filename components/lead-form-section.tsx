import { Check } from "@phosphor-icons/react/dist/ssr";
import { LeadForm } from "@/components/lead-form";
import { PhotoSlot } from "@/components/photo-slot";
import { WaButton } from "@/components/wa-button";
import { TelLink } from "@/components/tel-link";
import { getAppSettings } from "@/lib/settings";
import { buildWaLink } from "@/lib/wa";
import { WA_OFFICE_HOURS } from "@/lib/constants";

export async function LeadFormSection() {
  const settings = await getAppSettings();
  const waLink = buildWaLink(settings);

  return (
    <section id="ajukan" className="scroll-mt-6 border-y border-brand-100 bg-brand-50">
      <div className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_520px] lg:gap-14">
        <div>
          <h2 className="max-w-[22ch] text-3xl tracking-tight sm:text-4xl">
            Isi formulirnya, nanti saya yang hubungi.
          </h2>
          <p className="mt-4 max-w-[52ch] text-stone-700">
            Isinya pendek-pendek saja. Setelah dikirim, saya hubungi lewat
            WhatsApp untuk konsultasi gratis.
          </p>

          <ul className="mt-7 space-y-3.5 text-stone-700">
            {[
              "Konsultasinya gratis, dari awal sampai akhir",
              "Semua angka dijelaskan terbuka sebelum diputuskan",
              "Mau lanjut atau tidak bebas, santai saja",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check
                  weight="bold"
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-brand-600"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <PhotoSlot
            label="Tempat foto suasana konsultasi bersama nasabah pensiunan. Menunggu foto asli dari koordinator."
            ratio="aspect-video"
            className="mt-8 max-w-md"
          />
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-card-lg md:p-9">
          <LeadForm waLink={waLink} />

          <div className="mt-7 border-t border-stone-100 pt-6">
            <p className="font-bold text-navy-900">
              Lebih suka ngobrol langsung?
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WaButton waLink={waLink} className="w-full sm:w-auto" />
              <TelLink number={settings.waNumberDisplay} />
            </div>
            <p className="mt-3 text-sm text-stone-600">
              Dibalas cepat setiap hari {WA_OFFICE_HOURS}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
