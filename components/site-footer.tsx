import { HandCoins, Info, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { CTA_LABEL, LEGAL } from "@/lib/constants";
import { getAppSettings } from "@/lib/settings";
import { WaButton } from "@/components/wa-button";

const NAV_LINKS = [
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#bank-mitra", label: "Bank Mitra" },
  { href: "#cara-pengajuan", label: "Cara Pengajuan" },
  { href: "#ajukan", label: "Ajukan Sekarang" },
  { href: "#faq", label: "Tanya Jawab" },
];

export function SiteFooter() {
  const settings = getAppSettings();

  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-xl bg-bni-600 text-white"
              >
                <HandCoins weight="duotone" className="size-6" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-navy-900">
                {settings.siteTitle}
              </span>
            </div>
            <p className="mt-4 max-w-[46ch] text-stone-700">
              Jasa pendampingan pengajuan kredit pensiun untuk pensiunan
              TNI/Polri, PNS, BUMN, dan swasta di seluruh Indonesia. Dikelola
              tim kecil yang siap membantu Bapak/Ibu dari awal sampai cair.
            </p>
          </div>

          <nav aria-label="Navigasi halaman">
            <h3 className="text-sm font-bold uppercase tracking-wide text-navy-900">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-medium text-stone-700 transition-colors hover:text-bni-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-navy-900">
              Hubungi Kami
            </h3>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-stone-600">
              <WhatsappLogo weight="bold" className="size-4" aria-hidden="true" />
              WhatsApp / Telepon
            </p>
            <p className="mt-1 text-xl font-extrabold tracking-tight text-navy-900">
              {settings.waNumberDisplay}
            </p>
            <WaButton label={CTA_LABEL} className="mt-4 w-full sm:w-auto" />
          </div>
        </div>

        <div className="mt-12 rounded-xl border-2 border-navy-200 bg-white p-5">
          <p className="max-w-[80ch] font-bold leading-relaxed text-navy-900">
            {LEGAL.agentDisclaimer}
          </p>
        </div>

        <p className="mt-6 flex max-w-[80ch] items-start gap-2.5 text-sm leading-relaxed text-stone-600">
          <Info weight="bold" aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{LEGAL.ojkNeutralLine}</span>
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-stone-300 pt-6 text-sm text-stone-600">
          <p>&copy; 2026 {settings.siteTitle}. Halaman informasi agen independen.</p>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="font-medium underline decoration-stone-400 underline-offset-4 transition-colors hover:text-navy-900"
            >
              Kebijakan Privasi
            </a>
            <a
              href="/terms"
              className="font-medium underline decoration-stone-400 underline-offset-4 transition-colors hover:text-navy-900"
            >
              Syarat &amp; Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
