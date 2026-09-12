"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import { removeStoredImage } from "@/lib/remove-image";

const IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"];
// Folder yang boleh ditulis — cegah path traversal via folder abal-abal.
const ALLOWED_FOLDERS = ["testimonial-photos", "landing-photos"] as const;

export interface UploadResult {
  ok: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export async function uploadImageAction(
  formData: FormData
): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "");
  const maxMB = Number(formData.get("maxMB") ?? 2);

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Tidak ada file yang diterima." };
  }
  if (!(ALLOWED_FOLDERS as readonly string[]).includes(folder)) {
    return { ok: false, error: "Folder tujuan tidak diizinkan." };
  }
  if (!IMAGE_ACCEPT.includes(file.type)) {
    return { ok: false, error: "Format gambar harus JPG, PNG, atau WebP." };
  }
  if (file.size > maxMB * 1024 * 1024) {
    return { ok: false, error: `Ukuran gambar maksimal ${maxMB}MB.` };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { data, error } = await getInsforgeAdmin()
    .storage.from("images")
    .upload(path, file);

  if (error || !data?.url || !data?.key) {
    console.error("uploadImageAction error:", error);
    return { ok: false, error: error?.message || "Gagal mengunggah gambar." };
  }
  return { ok: true, url: data.url, key: data.key };
}

export async function deleteStoredImageAction(
  key: string
): Promise<{ ok: boolean }> {
  await requireAdmin();
  await removeStoredImage(key);
  return { ok: true };
}
