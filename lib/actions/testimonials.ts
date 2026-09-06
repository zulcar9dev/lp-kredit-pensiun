"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import type { Testimonial } from "@/lib/types/database";

export type TestimonialRow = Omit<Testimonial, "created_at">;

export async function fetchTestimonials(): Promise<TestimonialRow[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("fetchTestimonials error:", error);
    return [];
  }

  return data ?? [];
}

export async function createTestimonial(
  payload: Omit<Testimonial, "id" | "created_at">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("testimonials")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function updateTestimonial(
  id: string,
  payload: Partial<Omit<Testimonial, "id" | "created_at">>
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("testimonials")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteTestimonial(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
