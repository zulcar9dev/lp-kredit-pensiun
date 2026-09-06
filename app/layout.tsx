import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PixelScript } from "@/components/pixel-script";
import { SITE_URL } from "@/lib/site";
import { getAppSettings } from "@/lib/settings";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSettings();
  const pageTitle = `${settings.siteTitle} | Tinggal Chat, Saya Urus Sampai Cair`;
  const pageDescription =
    "Pendampingan pengajuan kredit pensiun untuk pensiunan TNI/Polri, PNS, BUMN, dan swasta. Konsultasi gratis via WhatsApp, ada pilihan produk dari beberapa bank mitra.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: pageTitle,
      template: `%s | ${settings.siteTitle}`,
    },
    description: pageDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "/",
      siteName: settings.siteTitle,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description:
        "Konsultasi gratis via WhatsApp, ada pilihan produk dari beberapa bank mitra.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FAFAF9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-dvh font-sans">
        {children}
        <PixelScript />
      </body>
    </html>
  );
}
