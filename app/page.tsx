import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { Advantages } from "@/components/advantages";
import { BankPartners } from "@/components/bank-partners";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { LeadFormSection } from "@/components/lead-form-section";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { ScrollTracker } from "@/components/scroll-tracker";
import { UtmCapture } from "@/components/utm-capture";
import { PixelScript } from "@/components/pixel-script";
import { SITE_URL } from "@/lib/site";
import { getAppSettings } from "@/lib/settings";
import { fetchLandingData } from "@/lib/fetch-landing";
import { buildWaLink } from "@/lib/wa";

export const dynamic = "force-dynamic";

async function StructuredData({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const settings = await getAppSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: `${settings.siteTitle} | Tinggal Chat, Saya Urus Sampai Cair`,
        description:
          "Pendampingan pengajuan kredit pensiun dari beberapa bank mitra untuk pensiunan TNI/Polri, PNS, BUMN, dan swasta.",
        inLanguage: "id-ID",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function Home() {
  const { bankProducts, testimonials, faqs } = await fetchLandingData();
  const settings = await getAppSettings();
  const waLink = buildWaLink(settings);

  return (
    <>
      <SiteHeader />
      <UtmCapture />
      <main>
        <Hero />
        <FloatingWhatsApp waLink={waLink} />
        <Advantages />
        <BankPartners products={bankProducts} />
        <HowItWorks />
        <ScrollTracker />
        <Testimonials items={testimonials} />
        <LeadFormSection />
        <Faq items={faqs} />
      </main>
      <SiteFooter />
      <StructuredData faqs={faqs} />
      <PixelScript />
    </>
  );
}
