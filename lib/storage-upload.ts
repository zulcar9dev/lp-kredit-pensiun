"use client";

import { createBrowserClient } from "@insforge/sdk/ssr";

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
  folder: string
): Promise<UploadedImage> {
  const client = createBrowserClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
  });

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { data, error } = await client.storage.from("images").upload(path, file);
  if (error || !data?.url || !data?.key) {
    throw new Error(error?.message || "Gagal mengunggah gambar.");
  }
  return { url: data.url, key: data.key };
}
