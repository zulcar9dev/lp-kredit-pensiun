import { getInsforgeAdmin } from "@/lib/insforge";
import type {
  BankProduct as DBBankProduct,
  Testimonial as DBTestimonial,
  Faq as DBFaq,
} from "@/lib/types/database";

export interface LandingData {
  bankProducts: DBBankProduct[];
  testimonials: DBTestimonial[];
  faqs: DBFaq[];
}

export async function fetchLandingData(): Promise<LandingData> {
  const [bankProductsRes, testimonialsRes, faqsRes] = await Promise.all([
    getInsforgeAdmin().database
      .from("bank_products")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("display_order", { ascending: true }),
    getInsforgeAdmin().database
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("display_order", { ascending: true }),
    getInsforgeAdmin().database
      .from("faq")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("display_order", { ascending: true }),
  ]);

  return {
    bankProducts: bankProductsRes.data ?? [],
    testimonials: testimonialsRes.data ?? [],
    faqs: faqsRes.data ?? [],
  };
}
