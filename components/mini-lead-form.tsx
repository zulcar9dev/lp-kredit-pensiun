"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  miniLeadSchema,
  type MiniLeadData,
  type MiniLeadInput,
} from "@/lib/schema";
import { saveLeadDraft } from "@/lib/draft";
import { FieldError, inputClass, labelClass } from "@/components/field";

export function MiniLeadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MiniLeadInput, unknown, MiniLeadData>({
    resolver: zodResolver(miniLeadSchema),
    defaultValues: { name: "", whatsapp: "" },
  });

  const onSubmit = handleSubmit((data) => {
    saveLeadDraft(data);
    const target = document.getElementById("ajukan");
    if (!target) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });

    const nameInput = document.getElementById("lead-name");
    if (nameInput) {
      window.setTimeout(() => nameInput.focus({ preventScroll: true }), 450);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="hero-name" className={`${labelClass} mb-1.5`}>
          Nama Lengkap
        </label>
        <input
          id="hero-name"
          type="text"
          autoComplete="name"
          placeholder="Contoh: Budi Santoso"
          aria-invalid={!!errors.name}
          className={inputClass}
          {...register("name")}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor="hero-whatsapp" className={`${labelClass} mb-1.5`}>
          No. WhatsApp
        </label>
        <input
          id="hero-whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Contoh: 081234567890"
          aria-invalid={!!errors.whatsapp}
          className={inputClass}
          {...register("whatsapp")}
        />
        <FieldError message={errors.whatsapp?.message} />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-bni-600 px-6 text-lg font-bold text-white shadow-card transition-colors hover:bg-bni-700 active:scale-[0.99]"
      >
        <span>Lanjutkan Pengajuan</span>
        <ArrowRight weight="bold" className="size-5" aria-hidden="true" />
      </button>

      <p className="text-sm leading-relaxed text-stone-600">
        Data Anda aman, hanya dipakai untuk konsultasi.
      </p>
    </form>
  );
}
