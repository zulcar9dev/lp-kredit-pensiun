import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="container-page max-w-3xl py-16 md:py-24">
      <h1 className="text-3xl tracking-tight sm:text-4xl">Kebijakan Privasi</h1>

      <div className="mt-8 space-y-6 leading-relaxed text-stone-700">
        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Data yang kami kumpulkan
          </h2>
          <p className="mt-2">
            Melalui formulir pengajuan di halaman ini, kami mengumpulkan: nama
            lengkap, nomor WhatsApp, jenis pensiun, provinsi, perkiraan nominal
            pinjaman yang dibutuhkan, dan bank pilihan (jika diisi).
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Penggunaan data
          </h2>
          <p className="mt-2">
            Data Anda hanya digunakan untuk mencarikan produk kredit pensiun
            dari bank mitra yang cocok dan menghubungi Anda untuk konsultasi.
            Kami tidak menjual atau membagikan data Anda kepada pihak lain di
            luar keperluan tersebut. Data produk mungkin diteruskan ke bank
            mitra pilihan Anda sebatas keperluan pengajuan.
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">Hak Anda</h2>
          <p className="mt-2">
            Anda berhak meminta penghapusan data yang Anda kirimkan. Silakan
            hubungi kami melalui nomor WhatsApp yang tertera di{" "}
            <Link
              href="/"
              className="font-semibold text-bni-700 underline decoration-bni-300 decoration-2 underline-offset-4"
            >
              halaman utama
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Posisi website ini
          </h2>
          <p className="mt-2">
            Website ini dikelola oleh agen pemasaran independen dan bukan
            bagian dari bank mana pun. Persetujuan kredit sepenuhnya merupakan
            wewenang bank.
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
