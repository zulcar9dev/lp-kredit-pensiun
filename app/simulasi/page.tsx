import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { Simulator } from "@/components/simulasi/simulator";

export const metadata: Metadata = {
  title: "Simulasi Kredit Pensiun",
  description:
    "Hitung sendiri estimasi plafon dan angsuran kredit pensiun, cukup dengan pendapatan dan tanggal lahir. Hasilnya langsung muncul, gratis dan tanpa data pribadi.",
  alternates: {
    canonical: "/simulasi",
  },
};

export default function SimulasiPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Simulator />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}
