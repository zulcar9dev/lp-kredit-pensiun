"use client";

import { useRef, useState } from "react";
import { CircleNotch, Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { uploadImage, validateImageFile, type UploadedImage } from "@/lib/storage-upload";

interface ImageUploadFieldProps {
  url: string;
  folder: string;
  maxSizeMB: number;
  hint?: string;
  onChange: (value: UploadedImage | null) => void;
}

export function ImageUploadField({
  url,
  folder,
  maxSizeMB,
  hint,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const invalid = validateImageFile(file, maxSizeMB);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const uploaded = await uploadImage(file, folder, maxSizeMB);
      onChange(uploaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Pratinjau"
            className="h-16 w-16 rounded-lg border border-stone-200 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-stone-300 text-xs text-stone-400">
            none
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? (
              <CircleNotch weight="bold" className="animate-spin" />
            ) : (
              <UploadSimple weight="bold" />
            )}
            {url ? "Ganti Gambar" : "Upload Gambar"}
          </button>
          {url && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onChange(null)}
              disabled={busy}
              style={{ color: "var(--red-500)" }}
            >
              <Trash weight="bold" />
              Hapus
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
}
