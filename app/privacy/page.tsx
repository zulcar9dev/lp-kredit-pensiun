import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  robots: { index: false },
};

// Alamat kanonis: /privacy-policy (PRD §7.2). Rute lama dipertahankan
// sebagai redirect agar bookmark lama tidak 404.
export default function PrivacyPage() {
  redirect("/privacy-policy");
}
