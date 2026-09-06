import Link from "next/link";
import { HandCoins } from "@phosphor-icons/react/dist/ssr";
import { WaButton } from "@/components/wa-button";
import { getAppSettings } from "@/lib/settings";
import { buildWaLink } from "@/lib/wa";

export async function SiteHeader() {
  const settings = await getAppSettings();
  const waLink = buildWaLink(settings);

  return (
    <header className="border-b border-stone-200 bg-stone-50">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={`${settings.siteTitle}, kembali ke halaman utama`}
        >
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white"
          >
            <HandCoins weight="duotone" className="size-6" />
          </span>
          <span className="truncate text-lg font-extrabold tracking-tight text-navy-900">
            {settings.siteTitle}
          </span>
        </Link>
        <WaButton waLink={waLink} />
      </div>
    </header>
  );
}
