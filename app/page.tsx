import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { Advantages } from "@/components/advantages";
import { BankPartners } from "@/components/bank-partners";
import { HowItWorks } from "@/components/how-it-works";
import { SimulationTeaser } from "@/components/simulation-teaser";
import { Testimonials } from "@/components/testimonials";
import { LeadFormSection } from "@/components/lead-form-section";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { ScrollTracker } from "@/components/scroll-tracker";
import { FAQS } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { getAppSettings } from "@/lib/settings";

function StructuredData() {
  const settings = getAppSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: `${settings.siteTitle} | Bantu Urus Pengajuan Kredit Pensiun Sampai Cair`,
        description:
          "Layanan pendampingan pengajuan kredit pensiun dari beberapa bank mitra untuk pensiunan TNI/Polri, PNS, BUMN, dan swasta.",
        inLanguage: "id-ID",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((faq) => ({
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <FloatingWhatsApp />
        <Advantages />
        <BankPartners />
        <HowItWorks />
        <SimulationTeaser />
        <ScrollTracker />
        <Testimonials />
        <LeadFormSection />
        <Faq />
      </main>
      <SiteFooter />
      <StructuredData />
    </>
  );
}
