"use client";

import { uploadImageAction } from "@/lib/actions/upload-image";

export const IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File, maxMB: number): string | null {
  if (!IMAGE_ACCEPT.includes(file.type)) {
    return "Format gambar harus JPG, PNG, atau WebP.";
  }
  if (file.size > maxMB * 1024 * 1024) {
    return `Ukuran gambar maksimal ${maxMB}MB.`;
  }
  return null;
}

export interface UploadedImage {
  url: string;
  key: string;
}

export async function uploadImage(
  file: File,
  folder: string,
  maxMB = 2
): Promise<UploadedImage> {
  const invalid = validateImageFile(file, maxMB);
  if (invalid) throw new Error(invalid);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("maxMB", String(maxMB));

  const result = await uploadImageAction(formData);
  if (!result.ok || !result.url || !result.key) {
    throw new Error(result.error || "Gagal mengunggah gambar.");
  }
  return { url: result.url, key: result.key };
}
