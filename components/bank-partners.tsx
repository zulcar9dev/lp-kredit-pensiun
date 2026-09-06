import Image from "next/image";
import { LEGAL } from "@/lib/constants";
import { formatRupiahShort } from "@/lib/format";
import type { BankProduct } from "@/lib/types/database";

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
    product.plafon_min && product.plafon_max
      ? `${formatRupiahShort(product.plafon_min)} - ${formatRupiahShort(product.plafon_max)}`
      : product.plafon_max
        ? `hingga ${formatRupiahShort(product.plafon_max)}`
        : "Menyesuaikan";

  const tenor =
    product.tenor_min && product.tenor_max
      ? `${product.tenor_min}-${product.tenor_max} tahun`
      : undefined;

  return (
    <article className="flex w-[280px] shrink-0 snap-start flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-card sm:w-[320px]">
      <div className="flex items-center gap-3.5">
        {product.logo_url ? (
          <Image
            src={product.logo_url}
            alt={`Logo ${product.bank_name}`}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-xl border border-stone-200 object-contain p-1"
          />
        ) : (
          <BankInitial name={product.bank_name} />
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-extrabold tracking-tight text-navy-900">
            {product.bank_name}
          </h3>
          {product.product_name && (
            <p className="truncate text-sm text-stone-600">
              {product.product_name}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-5 space-y-2.5 border-t border-stone-100 pt-5">
        <SpecLine label="Plafon" value={plafon} />
        {tenor && <SpecLine label="Tenor" value={tenor} />}
        {typeof product.bunga_indikatif === "number" && (
          <SpecLine
            label="Bunga indikatif"
            value={`${product.bunga_indikatif.toFixed(2).replace(".", ",")}% per tahun`}
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

export function BankPartners({ products }: { products: BankProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section id="bank-mitra" className="bg-white">
      <div className="container-page py-16 md:py-24">
        <h2 className="max-w-[26ch] text-3xl tracking-tight sm:text-4xl">
          Ini beberapa pilihan dari bank mitra kami.
        </h2>
        <p className="mt-4 max-w-[56ch] text-stone-700">
          Angka di bawah masih indikatif, belum final. Angka pastinya baru
          diberitahu bank saat konsultasi.
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
