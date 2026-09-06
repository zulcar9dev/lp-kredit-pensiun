"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CaretDown,
  CheckCircle,
  CircleNotch,
} from "@phosphor-icons/react/dist/ssr";
import {
  BANK_DEFAULT_OPTION,
  LOAN_DEFAULT,
  LOAN_MAX,
  LOAN_MIN,
  LOAN_STEP,
  PENSION_TYPES,
} from "@/lib/constants";
import { PROVINCES } from "@/lib/provinces";
import { leadSchema, type LeadData, type LeadInput } from "@/lib/schema";
import { clearLeadDraft, readLeadDraft, takeLeadDraftLoanAmount } from "@/lib/draft";
import { readStoredUtm } from "@/lib/utm";
import { submitLead } from "@/lib/submit-lead";
import { formatRupiahShort } from "@/lib/format";
import { buildWaLeadMessage } from "@/lib/wa";
import { trackPixel } from "@/lib/pixel";
import { sendCapiEvent } from "@/lib/capi";
import { FieldError, inputClass, labelClass } from "@/components/field";
import { WaButton } from "@/components/wa-button";
import type { BankProduct } from "@/lib/types/database";

export function LeadForm({ bankProducts = [], waLink, waNumberIntl }: { bankProducts?: BankProduct[]; waLink: string; waNumberIntl: string }) {
  const BANK_OPTIONS = [
    BANK_DEFAULT_OPTION,
    ...bankProducts.map(
      (product) =>
        product.product_name
          ? `${product.bank_name} - ${product.product_name}`
          : product.bank_name,
    ),
  ];

  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [personalizedWaLink, setPersonalizedWaLink] = useState<string | null>(null);
  const [carriedFromEstimate, setCarriedFromEstimate] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<LeadInput, unknown, LeadData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      pensionType: undefined,
      province: "",
      loanAmount: LOAN_DEFAULT,
      interestedBank: BANK_DEFAULT_OPTION,
    },
  });

  useEffect(() => {
    const draft = readLeadDraft();
    const simLoanAmount = takeLeadDraftLoanAmount();
    if (draft.name || draft.whatsapp || simLoanAmount !== undefined) {
      reset({
        name: draft.name ?? "",
        whatsapp: draft.whatsapp ?? "",
        loanAmount: simLoanAmount ?? LOAN_DEFAULT,
        interestedBank: BANK_DEFAULT_OPTION,
      });
    }
    if (simLoanAmount !== undefined) {
      setCarriedFromEstimate(true);
    }
  }, [reset]);

  const loanAmount = watch("loanAmount") ?? LOAN_DEFAULT;

  const onSubmit = handleSubmit(async (data) => {
    setStatus("submitting");
    setServerError(null);

    const { interestedBank, ...rest } = data;
    const result = await submitLead({
      ...rest,
      interested_bank: interestedBank || undefined,
      ...readStoredUtm(),
    });

    if (result.ok) {
      const eventId = `lead-${Date.now()}`;
      trackPixel("Lead", { event_id: eventId, content_name: "Kredit Pensiun" });
      sendCapiEvent("Lead", eventId, {
        ph: data.whatsapp,
      }, {
        content_name: "Kredit Pensiun",
      });
      clearLeadDraft();
      const personalizedMsg = buildWaLeadMessage(data);
      setPersonalizedWaLink(`https://wa.me/${waNumberIntl}?text=${encodeURIComponent(personalizedMsg)}`);
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
          Terima kasih, datanya sudah masuk.
        </h3>
        <p className="mt-2 max-w-[52ch] text-stone-700">
          Nanti saya hubungi lewat WhatsApp untuk carikan produk yang paling
          cocok. Mau lebih cepat? Chat saja sekarang.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <WaButton waLink={personalizedWaLink ?? waLink} size="lg" />
          <button
            type="button"
            onClick={() => {
              reset({
                name: "",
                whatsapp: "",
                pensionType: undefined,
                province: "",
                loanAmount: LOAN_DEFAULT,
                interestedBank: BANK_DEFAULT_OPTION,
              });
              setStatus("idle");
            }}
            className="inline-flex min-h-[56px] items-center justify-center rounded-xl border-2 border-navy-200 px-6 font-semibold text-navy-800 transition-colors hover:border-navy-400 active:scale-[0.98]"
          >
            Isi formulir lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={`${labelClass} mb-1.5`}>
            Nama Lengkap
          </label>
          <input
            id="lead-name"
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
          <label htmlFor="lead-whatsapp" className={`${labelClass} mb-1.5`}>
            No. WhatsApp
          </label>
          <input
            id="lead-whatsapp"
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
          <label htmlFor="lead-pension" className={`${labelClass} mb-1.5`}>
            Jenis Pensiun
          </label>
          <div className="relative">
            <select
              id="lead-pension"
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
          <label htmlFor="lead-province" className={`${labelClass} mb-1.5`}>
            Provinsi
          </label>
          <div className="relative">
            <select
              id="lead-province"
              aria-invalid={!!errors.province}
              className={`${inputClass} appearance-none pr-11 ${watch("province") ? "" : "text-stone-500"}`}
              {...register("province")}
            >
              <option value="" disabled>
                Pilih provinsi
              </option>
              {PROVINCES.map((province) => (
                <option key={province} value={province} className="text-navy-900">
                  {province}
                </option>
              ))}
            </select>
            <CaretDown
              weight="bold"
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-stone-500"
            />
          </div>
          <FieldError message={errors.province?.message} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="lead-bank" className={`${labelClass} mb-1.5`}>
            Bank Pilihan{" "}
            <span className="font-medium text-stone-500">(opsional)</span>
          </label>
          <div className="relative">
            <select
              id="lead-bank"
              className={`${inputClass} appearance-none pr-11`}
              {...register("interestedBank")}
            >
              {BANK_OPTIONS.map((bank) => (
                <option key={bank} value={bank} className="text-navy-900">
                  {bank}
                </option>
              ))}
            </select>
            <CaretDown
              weight="bold"
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-stone-500"
            />
          </div>
          <FieldError message={errors.interestedBank?.message} />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <label htmlFor="lead-loan" className={labelClass}>
            Nominal Pinjaman{" "}
            <span className="font-medium text-stone-500">(opsional)</span>
          </label>
          <output
            htmlFor="lead-loan"
            className="text-lg font-extrabold text-bni-700"
          >
            {formatRupiahShort(loanAmount)}
          </output>
        </div>
        <Controller
          name="loanAmount"
          control={control}
          render={({ field }) => (
            <input
              id="lead-loan"
              type="range"
              min={LOAN_MIN}
              max={LOAN_MAX}
              step={LOAN_STEP}
              value={field.value ?? LOAN_DEFAULT}
              onChange={(event) => field.onChange(Number(event.target.value))}
              onBlur={field.onBlur}
              name={field.name}
              className="mt-3 h-2 w-full cursor-pointer accent-bni-600"
            />
          )}
        />
        <div className="mt-1.5 flex justify-between text-sm font-medium text-stone-500">
          <span>Rp 10 juta</span>
          <span>Rp 500 juta</span>
        </div>
        {carriedFromEstimate && (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 rounded-xl border border-bni-200 bg-bni-50 px-4 py-3 text-sm font-semibold text-navy-900"
          >
            <CheckCircle
              weight="fill"
              className="size-5 shrink-0 text-bni-600"
              aria-hidden="true"
            />
            <span>
              Nominalnya mengikuti estimasi plafon Bapak/Ibu. Silakan ubah
              kalau perlu.
            </span>
          </p>
        )}
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
        className="inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-xl bg-bni-600 px-7 text-lg font-bold text-white shadow-card transition-colors hover:bg-bni-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
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

      <p className="text-sm leading-relaxed text-stone-600">
        Dengan mengirim formulir ini, Bapak/Ibu setuju untuk dihubungi. Data
        hanya dipakai mencarikan produk kredit pensiun yang cocok dan tidak
        dibagikan sembarangan.
      </p>
    </form>
  );
}
