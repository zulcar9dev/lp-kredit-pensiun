import Image from "next/image";
import { getActiveBankProducts, type BankProduct } from "@/lib/bank-products";
import { LEGAL } from "@/lib/constants";
import { formatRupiahShort } from "@/lib/format";

function BankInitial({ name }: { name: string }) {
  const initials = name
    .replace(/^Bank\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-sm font-extrabold tracking-tight text-white"
    >
      {initials}
    </span>
  );
}

function SpecLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-sm font-medium text-stone-500">{label}</dt>
      <dd className="text-right font-bold text-navy-900">{value}</dd>
    </div>
  );
}

function BankCard({ product }: { product: BankProduct }) {
  const plafon =
    product.plafonMin && product.plafonMax
      ? `${formatRupiahShort(product.plafonMin)} - ${formatRupiahShort(product.plafonMax)}`
      : product.plafonMax
        ? `hingga ${formatRupiahShort(product.plafonMax)}`
        : "Menyesuaikan";

  const tenor =
    product.tenorMinYears && product.tenorMaxYears
      ? `${product.tenorMinYears}-${product.tenorMaxYears} tahun`
      : undefined;

  return (
    <article className="flex w-[280px] shrink-0 snap-start flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-card sm:w-[320px]">
      <div className="flex items-center gap-3.5">
        {product.logoUrl ? (
          <Image
            src={product.logoUrl}
            alt={`Logo ${product.bankName}`}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-xl border border-stone-200 object-contain p-1"
          />
        ) : (
          <BankInitial name={product.bankName} />
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-extrabold tracking-tight text-navy-900">
            {product.bankName}
          </h3>
          {product.productName && (
            <p className="truncate text-sm text-stone-600">
              {product.productName}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-5 space-y-2.5 border-t border-stone-100 pt-5">
        <SpecLine label="Plafon" value={plafon} />
        {tenor && <SpecLine label="Tenor" value={tenor} />}
        {typeof product.bungaIndikatif === "number" && (
          <SpecLine
            label="Bunga indikatif"
            value={`${product.bungaIndikatif.toFixed(2).replace(".", ",")}% per tahun`}
          />
        )}
      </dl>

      {product.notes && (
        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          {product.notes}
        </p>
      )}
    </article>
  );
}

export function BankPartners() {
  const products = getActiveBankProducts();
  if (products.length === 0) return null;

  return (
    <section id="bank-mitra" className="bg-white">
      <div className="container-page py-16 md:py-24">
        <h2 className="max-w-[26ch] text-3xl tracking-tight sm:text-4xl">
          Ada beberapa pilihan dari bank mitra kami.
        </h2>
        <p className="mt-4 max-w-[56ch] text-stone-700">
          Angka di bawah masih indikatif. Angka final selalu diberitahu bank
          saat konsultasi.
        </p>

        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {products.map((product) => (
            <BankCard key={product.id} product={product} />
          ))}
        </div>

        <p className="text-sm text-stone-600">{LEGAL.indicativeNote}</p>
      </div>
    </section>
  );
}
