import type { Metadata } from "next";
import Link from "next/link";
import { WA_OFFICE_HOURS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container-page max-w-3xl py-16 md:py-24">
      <h1 className="text-3xl tracking-tight sm:text-4xl">Kebijakan Privasi</h1>
      <p className="mt-3 text-stone-600">
        Kebijakan ini menjelaskan bagaimana data pribadi Bapak/Ibu kami
        kumpulkan dan pakai, sesuai Undang-Undang Perlindungan Data Pribadi
        (UU No. 27 Tahun 2022).
      </p>

      <div className="mt-8 space-y-6 leading-relaxed text-stone-700">
        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Data yang kami kumpulkan
          </h2>
          <p className="mt-2">
            Kalau Bapak/Ibu mengisi formulir pengajuan, data yang kami terima
            adalah: nama lengkap, nomor WhatsApp, jenis pensiun, pengajuan
            untuk diri sendiri atau orang tua, dan perkiraan nominal pinjaman
            (kalau diisi).
          </p>
          <p className="mt-2">
            Selain itu, saat Bapak/Ibu membuka halaman ini, tercatat secara
            otomatis: alamat IP, jenis perangkat/peramban, halaman yang
            dikunjungi, sumber kunjungan (parameter UTM), serta cookie
            pengukuran dari Meta (Facebook) berupa <code>_fbp</code> dan{" "}
            <code>_fbc</code>. Cookie ini dipakai untuk mengukur performa
            iklan, bukan untuk mengenali identitas pribadi Bapak/Ibu.
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Datanya dipakai untuk apa
          </h2>
          <p className="mt-2">
            Data Bapak/Ibu hanya dipakai untuk dua hal: mencarikan produk
            kredit pensiun yang cocok dari bank mitra, dan menghubungi
            Bapak/Ibu untuk konsultasi. Sebatas keperluan pengajuan, data boleh
            diteruskan ke bank mitra pilihan Bapak/Ibu. Kami tidak menjual
            atau menyebarkan data ke pihak lain di luar itu.
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Dasar pemrosesan & persetujuan
          </h2>
          <p className="mt-2">
            Data Bapak/Ibu kami proses berdasarkan persetujuan Bapak/Ibu
            sendiri — ditandai dengan mencentang kotak persetujuan sebelum
            formulir dikirim. Waktu persetujuan tercatat sebagai bukti. Tanpa
            persetujuan, formulir tidak bisa dikirim.
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Berapa lama data disimpan
          </h2>
          <p className="mt-2">
            Data disimpan selama masih relevan untuk keperluan konsultasi dan
            pengajuan. Bila Bapak/Ibu meminta penghapusan, datanya kami hapus
            dari sistem kami.
          </p>
        </section>

        <section>
          <h2 className="text-xl tracking-tight text-navy-900">
            Hak Bapak/Ibu
          </h2>
          <p className="mt-2">
            Bapak/Ibu berhak meminta akses, perbaikan, atau penghapusan data
            pribadi, serta menarik persetujuan kapan saja. Caranya mudah,
            hubungi nomor WhatsApp yang tertera di{" "}
            <Link
              href="/"
              className="font-semibold text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-4"
            >
              halaman utama
            </Link>{" "}
            (dibalas setiap hari {WA_OFFICE_HOURS}).
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
        className="mt-10 inline-flex min-h-[48px] items-center rounded-xl border-2 border-navy-200 px-5 font-semibold text-navy-800 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        Kembali ke halaman utama
      </Link>
    </main>
  );
}
