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
            Kalau Bapak/Ibu mengisi formulir pengajuan, data yang kami terima
            adalah: nama lengkap, nomor WhatsApp, jenis pensiun, provinsi,
            perkiraan nominal pinjaman yang dibutuhkan, dan bank pilihan
            (kalau diisi).
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Datanya dipakai untuk apa
          </h2>
          <p className="mt-2">
            Data Bapak/Ibu hanya dipakai untuk dua hal: mencarikan produk
            kredit pensiun yang cocok dari bank mitra, dan menghubungi
            Bapak/Ibu untuk konsultasi. Kami tidak menjual atau menyebarkan
            data ke pihak lain di luar itu. Sebatas keperluan pengajuan, data
            produk boleh diteruskan ke bank mitra pilihan Bapak/Ibu.
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Hak Bapak/Ibu
          </h2>
          <p className="mt-2">
            Bapak/Ibu berhak meminta datanya dihapus kapan saja. Caranya
            mudah, hubungi saja nomor WhatsApp yang tertera di{" "}
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
