import { getInsforgeAdmin } from "@/lib/insforge";
import type {
  Testimonial as DBTestimonial,
  Faq as DBFaq,
} from "@/lib/types/database";

export interface LandingData {
  testimonials: DBTestimonial[];
  faqs: DBFaq[];
}

export async function fetchLandingData(): Promise<LandingData> {
  const [testimonialsRes, faqsRes] = await Promise.all([
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
    testimonials: testimonialsRes.data ?? [],
    faqs: faqsRes.data ?? [],
  };
}
