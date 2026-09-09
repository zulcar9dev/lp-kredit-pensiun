"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CheckCircle,
  CircleNotch,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";
import {
  APPLICANT_RELATION_OPTIONS,
  CONSENT_TEXT,
  LOAN_MAX,
  LOAN_MIN,
  LOAN_PRESETS,
  PENSION_TYPES,
  PIXEL_CONTENT_NAME,
  WA_OFFICE_HOURS,
} from "@/lib/constants";
import { leadSchema, type LeadData, type LeadInput } from "@/lib/schema";
import { clearLeadDraft, readLeadDraft } from "@/lib/draft";
import { readFbpCookie, readStoredFbc, readStoredUtm } from "@/lib/utm";
import { submitLead } from "@/lib/submit-lead";
import { formatRupiahShort } from "@/lib/format";
import { generateEventId, trackPixel } from "@/lib/pixel";
import { FieldError, inputClass, labelClass } from "@/components/field";
import { WaButton } from "@/components/wa-button";

export function LeadForm({
  waLink,
  idPrefix = "lead",
}: {
  waLink: string;
  // Prefix ID agar dua form sehalaman (Hero + section #ajukan) tidak
  // punya id duplikat. Hero memakai idPrefix="hero".
  idPrefix?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [customLoan, setCustomLoan] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const fid = (name: string) => `${idPrefix}-${name}`;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeadInput, unknown, LeadData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      applicantRelation: "sendiri",
    },
  });

  useEffect(() => {
    const draft = readLeadDraft();
    if (draft.name || draft.whatsapp) {
      reset({
        name: draft.name ?? "",
        whatsapp: draft.whatsapp ?? "",
        applicantRelation: "sendiri",
      });
    }
  }, [reset]);

  const applicantRelation = watch("applicantRelation");

  const resetForm = () => {
    reset();
    setCustomLoan(false);
    setStatus("idle");
  };

  const onSubmit = handleSubmit(async (data) => {
    // Honeypot terisi → bot: abaikan tanpa pesan
    if (honeypotRef.current?.value) return;

    setStatus("submitting");
    setServerError(null);

    const result = await submitLead({
      name: data.name,
      whatsapp: data.whatsapp,
      pensionType: data.pensionType,
      applicantRelation: data.applicantRelation,
      loanAmount: data.loanAmount,
      consent: data.consent,
      website: honeypotRef.current?.value ?? "",
      event_id: generateEventId(),
      fbp: readFbpCookie(),
      fbc: readStoredFbc(),
      ...readStoredUtm(),
    });

    if (result.ok) {
      if (result.eventId) {
        trackPixel(
          "Lead",
          { content_name: PIXEL_CONTENT_NAME },
          { eventID: result.eventId },
        );
      }
      clearLeadDraft();
      setSuccessName(data.name);
      setSuccessLeadId(result.leadId ?? null);
      setStatus("success");
    } else {
      setServerError(
        result.message ??
          "Terjadi kendala saat mengirim. Mohon coba sekali lagi.",
      );
      setStatus("idle");
    }
  });

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 md:p-8"
      >
        <CheckCircle
          weight="fill"
          className="size-12 text-emerald-600"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-2xl tracking-tight text-navy-900">
          Terima kasih, Bapak/Ibu {successName}.
        </h3>
        <p className="mt-2 max-w-[52ch] text-stone-700">
          Datanya sudah masuk. Tim kami akan menghubungi lewat WhatsApp pada
          jam {WA_OFFICE_HOURS}. Mau lebih cepat? Lanjut chat saja sekarang.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <WaButton
            waLink={waLink}
            leadRef={successLeadId}
            size="lg"
            label="Lanjut Chat WhatsApp Sekarang"
            className="w-full"
          />
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl border-2 border-navy-200 px-6 font-semibold text-navy-800 transition-colors hover:border-navy-400 active:scale-[0.98]"
          >
            Isi formulir lagi
          </button>
        </div>
      </div>
    );
  }

  const chipBase =
    "min-h-[48px] rounded-xl border-2 px-5 text-base font-semibold transition-colors active:scale-[0.98]";
  const chipActive = "border-brand-600 bg-brand-600 text-white";
  const chipIdle = "border-navy-200 bg-white text-navy-800 hover:border-navy-400";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative space-y-5"
    >
      {/* Honeypot anti-bot — tersembunyi dari manusia */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto size-px overflow-hidden"
      >
        <label htmlFor={fid("website")}>Website</label>
        <input
          id={fid("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fid("name")} className={`${labelClass} mb-1.5`}>
            Nama Lengkap
          </label>
          <input
            id={fid("name")}
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
          <label htmlFor={fid("whatsapp")} className={`${labelClass} mb-1.5`}>
            No. WhatsApp
          </label>
          <input
            id={fid("whatsapp")}
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

        <div>
          <label htmlFor={fid("pension")} className={`${labelClass} mb-1.5`}>
            Jenis Pensiun
          </label>
          <div className="relative">
            <select
              id={fid("pension")}
              aria-invalid={!!errors.pensionType}
              className={`${inputClass} appearance-none pr-11 ${watch("pensionType") ? "" : "text-stone-500"}`}
              {...register("pensionType")}
            >
              <option value="" disabled>
                Pilih jenis pensiun
              </option>
              {PENSION_TYPES.map((type) => (
                <option key={type} value={type} className="text-navy-900">
                  {type}
                </option>
              ))}
            </select>
            <CaretDown
              weight="bold"
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-stone-500"
            />
          </div>
          <FieldError message={errors.pensionType?.message} />
        </div>

        <div>
          <span className={`${labelClass} mb-1.5 block`}>
            Pengajuan Untuk{" "}
            <span className="font-medium text-stone-500">(opsional)</span>
          </span>
          <div
            role="group"
            aria-label="Pengajuan untuk siapa"
            className="grid grid-cols-2 gap-2"
          >
            {APPLICANT_RELATION_OPTIONS.map((option) => {
              const active = applicantRelation === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setValue("applicantRelation", option.value, {
                      shouldValidate: true,
                    })
                  }
                  className={`min-h-[56px] rounded-xl border-2 px-3 text-base font-semibold transition-colors active:scale-[0.98] ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-navy-200 bg-white text-navy-800 hover:border-navy-400"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <span className={`${labelClass} block`}>
          Nominal Pinjaman{" "}
          <span className="font-medium text-stone-500">(opsional)</span>
        </span>
        <Controller
          name="loanAmount"
          control={control}
          render={({ field }) =>
            customLoan ? (
              <div className="mt-1.5">
                <input
                  type="number"
                  inputMode="numeric"
                  min={LOAN_MIN}
                  max={LOAN_MAX}
                  step={1_000_000}
                  placeholder="Contoh: 75000000"
                  aria-invalid={!!errors.loanAmount}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomLoan(false);
                    field.onChange(undefined);
                  }}
                  className="mt-2 text-sm font-semibold text-brand-700 underline"
                >
                  Kembali ke pilihan nominal
                </button>
                <FieldError message={errors.loanAmount?.message} />
              </div>
            ) : (
              <div className="mt-1.5">
                <div className="flex flex-wrap gap-2">
                  {LOAN_PRESETS.map((preset) => {
                    const active = field.value === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={active}
                        onClick={() => field.onChange(preset)}
                        className={`${chipBase} ${active ? chipActive : chipIdle}`}
                      >
                        {formatRupiahShort(preset)}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-pressed={false}
                    onClick={() => {
                      setCustomLoan(true);
                      field.onChange(undefined);
                    }}
                    className={`${chipBase} ${chipIdle}`}
                  >
                    Lainnya
                  </button>
                </div>
                <FieldError message={errors.loanAmount?.message} />
              </div>
            )
          }
        />
      </div>

      <div>
        <label
          htmlFor={fid("consent")}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4"
        >
          <input
            id={fid("consent")}
            type="checkbox"
            aria-invalid={!!errors.consent}
            className="mt-0.5 size-5 shrink-0 accent-brand-600"
            {...register("consent")}
          />
          <span className="text-sm leading-relaxed text-stone-700">
            {CONSENT_TEXT}{" "}
            <a
              href="/privacy-policy"
              className="font-semibold text-brand-700 underline"
            >
              Kebijakan Privasi
            </a>
            .
          </span>
        </label>
        <FieldError message={errors.consent?.message} />
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-xl bg-brand-600 px-7 text-lg font-bold text-white shadow-card transition-colors hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <CircleNotch
              weight="bold"
              className="size-6 animate-spin"
              aria-hidden="true"
            />
            <span>Mengirim...</span>
          </>
        ) : (
          <span>Kirim Pengajuan</span>
        )}
      </button>
    </form>
  );
}
