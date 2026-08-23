import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <main className="container-page max-w-3xl py-16 md:py-24">
      <h1 className="text-3xl tracking-tight sm:text-4xl">
        Syarat &amp; Ketentuan
      </h1>

      <div className="mt-8 space-y-6 leading-relaxed text-stone-700">
        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Sifat informasi di halaman ini
          </h2>
          <p className="mt-2">{LEGAL.generalDisclaimer}</p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Posisi agen independen
          </h2>
          <p className="mt-2">{LEGAL.agentDisclaimer}</p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Proses pengajuan
          </h2>
          <p className="mt-2">
            Pengajuan dimulai dengan konsultasi bersama kami. Produk berasal
            dari bank mitra, sehingga keputusan persetujuan kredit, besar
            bunga, dan jangka waktu mengikuti syarat resmi bank terkait yang
            akan dijelaskan kepada Anda secara lengkap sebelum tanda tangan
            dokumen apa pun.
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Tanpa kewajiban
          </h2>
          <p className="mt-2">
            Mengisi formulir atau melakukan konsultasi tidak mewajibkan Anda
            mengambil produk. Anda bebas memutuskan setelah menerima penjelasan.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex min-h-[48px] items-center rounded-xl border-2 border-navy-200 px-5 font-semibold text-navy-800 transition-colors hover:border-bni-400 hover:text-bni-700"
      >
        Kembali ke halaman utama
      </Link>
    </main>
  );
}
