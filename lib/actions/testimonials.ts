"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import { removeStoredImage } from "@/lib/remove-image";
import { testimonialServerSchema, zodErrorMessage } from "@/lib/schema";
import type { Testimonial } from "@/lib/types/database";

export type TestimonialRow = Omit<Testimonial, "created_at">;

export async function fetchTestimonials(): Promise<TestimonialRow[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("testimonials")
    .select("*")
    .is("deleted_at", null)
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
  const parsed = testimonialServerSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  const { data, error } = await getInsforgeAdmin().database
    .from("testimonials")
    .insert([parsed.data])
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
  const parsed = testimonialServerSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  // Hanya kolom yang dikirim (agar default Zod tak menimpa sisanya)
  const update: Record<string, unknown> = {};
  for (const k of Object.keys(payload)) {
    update[k] = (parsed.data as Record<string, unknown>)[k];
  }
  const { data: current } = await getInsforgeAdmin().database
    .from("testimonials")
    .select("photo_key")
    .eq("id", id)
    .single();

  const { error } = await getInsforgeAdmin().database
    .from("testimonials")
    .update(update)
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }

  if (
    payload.photo_key !== undefined &&
    current?.photo_key &&
    current.photo_key !== payload.photo_key
  ) {
    await removeStoredImage(current.photo_key);
  }
  return { ok: true };
}

export async function deleteTestimonial(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  // Soft delete — section landing otomatis menyembunyikan baris ter-soft-delete
  const { error } = await getInsforgeAdmin().database
    .from("testimonials")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
