"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import {
  CATEGORY_LABELS,
  formatTenorID,
  type SimCategory,
} from "@/lib/simulasi/constants";
import {
  computeAgeDetail,
  getMaxTenorMonths,
  getNearestAgeMonths,
  simulate,
} from "@/lib/simulasi/engine";
import { saveLeadDraft } from "@/lib/draft";
import { formatRupiah, formatRupiahShort } from "@/lib/format";
import { LEGAL, LOAN_MAX, LOAN_MIN, LOAN_STEP } from "@/lib/constants";
import { inputClass, labelClass } from "@/components/field";
import { WaButton } from "@/components/wa-button";

const INCOME_MIN = 500_000;
const INCOME_MAX = 20_000_000;
const INCOME_STEP = 250_000;
const INCOME_DEFAULT = 3_500_000;
const TENOR_TARGET_MONTHS = 60;

export function HeroEstimator() {
  const [category, setCategory] = useState<SimCategory>("purna");
  const [income, setIncome] = useState(INCOME_DEFAULT);
  const [birthDate, setBirthDate] = useState("");

  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => today.toISOString().slice(0, 10), [today]);

  const birth = useMemo(
    () => (birthDate ? new Date(birthDate) : null),
    [birthDate],
  );
  const ageDetail = useMemo(
    () => (birth ? computeAgeDetail(birth, today) : null),
    [birth, today],
  );
  const nearestAgeMonths = useMemo(
    () => (birth ? getNearestAgeMonths(birth, today) : null),
    [birth, today],
  );
  const maxTenorMonths = useMemo(
    () =>
      nearestAgeMonths !== null
        ? getMaxTenorMonths(category, nearestAgeMonths)
        : null,
    [category, nearestAgeMonths],
  );

  const effectiveTenorMonths =
    maxTenorMonths !== null
      ? Math.min(TENOR_TARGET_MONTHS, maxTenorMonths)
      : TENOR_TARGET_MONTHS;

  const ready =
    income > 0 &&
    birth !== null &&
    !isNaN(birth.getTime()) &&
    maxTenorMonths !== null &&
    maxTenorMonths > 0;

  const result = useMemo(() => {
    if (!ready) return null;
    return simulate({
      category,
      income,
      birthDate,
      tenorMonths: effectiveTenorMonths,
    });
  }, [ready, category, income, birthDate, effectiveTenorMonths]);

  function handleAjukanDenganEstimasi() {
    if (!result || !result.eligible) return;

    const clamped = Math.min(
      LOAN_MAX,
      Math.max(LOAN_MIN, Math.floor(result.plafonMaks / LOAN_STEP) * LOAN_STEP),
    );
    saveLeadDraft({ loanAmount: clamped });

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
  }

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className={`${labelClass} mb-1.5`}>Status Saat Ini</legend>
        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-stone-100 p-1.5">
          {(Object.keys(CATEGORY_LABELS) as SimCategory[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
              className={`min-h-[44px] rounded-xl px-3 text-sm font-bold transition-colors sm:text-base ${
                category === key
                  ? "bg-white text-navy-900 shadow-card"
                  : "text-stone-600 hover:text-navy-900"
              }`}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <label htmlFor="hero-income" className={labelClass}>
            Pendapatan Pensiun per Bulan
          </label>
          <output
            htmlFor="hero-income"
            className="text-lg font-extrabold tabular-nums text-bni-700"
          >
            {formatRupiahShort(income)}
          </output>
        </div>
        <input
          id="hero-income"
          type="range"
          min={INCOME_MIN}
          max={INCOME_MAX}
          step={INCOME_STEP}
          value={income}
          onChange={(event) => setIncome(Number(event.target.value))}
          aria-valuetext={formatRupiahShort(income)}
          className="mt-3 h-2 w-full cursor-pointer accent-bni-600"
        />
        <div className="mt-1.5 flex justify-between text-sm font-medium text-stone-500">
          <span>Rp 500 ribu</span>
          <span>Rp 20 juta</span>
        </div>
      </div>

      <div>
        <label htmlFor="hero-birth" className={`${labelClass} mb-1.5`}>
          Tanggal Lahir
        </label>
        <input
          id="hero-birth"
          type="date"
          value={birthDate}
          max={todayIso}
          onChange={(event) => setBirthDate(event.target.value)}
          aria-invalid={!!birthDate && !ageDetail}
          className={inputClass}
        />
        {ageDetail && (
          <p className="mt-2 text-sm font-semibold text-bni-700">
            Usia saat ini: {ageDetail.years} tahun {ageDetail.months} bulan
          </p>
        )}
      </div>

      <div aria-live="polite">
        {!result ? (
          <div
            role="status"
            className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center"
          >
            <Calculator
              weight="duotone"
              className="mx-auto size-10 text-stone-300"
              aria-hidden="true"
            />
            <p className="mt-3 font-bold text-navy-900">
              Estimasi langsung muncul di sini.
            </p>
            <p className="mx-auto mt-1 max-w-[36ch] text-sm text-stone-700">
              Lengkapi tanggal lahir di atas untuk melihat hasilnya.
            </p>
          </div>
        ) : !result.eligible ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <Warning
              weight="fill"
              className="mt-0.5 size-5 shrink-0 text-red-500"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold text-navy-900">
                Belum bisa dihitung dengan data ini.
              </p>
              <p className="mt-1 text-sm text-stone-700">{result.error}</p>
              <WaButton className="mt-3 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-navy-900 p-5 text-white">
              <p className="text-sm font-semibold text-white/70">
                Perkiraan Plafon Maksimal
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums">
                {formatRupiahShort(result.plafonMaks)}
              </p>
              <div className="mt-4 border-t border-white/15 pt-3">
                <p className="text-sm font-semibold text-white/70">
                  Angsuran per Bulan
                </p>
                <p className="mt-0.5 text-xl font-extrabold tracking-tight tabular-nums">
                  {formatRupiah(result.angsuran)}
                </p>
              </div>
              <p className="mt-3 text-xs text-white/70">
                Dengan tenor {formatTenorID(effectiveTenorMonths)} · bunga
                indikatif {result.ratePercent}% per tahun
              </p>
            </div>

            {result.plafonMaks < LOAN_MIN && (
              <div
                role="status"
                className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm"
              >
                <Warning
                  weight="fill"
                  className="mt-0.5 size-5 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                <p className="text-amber-800">
                  Estimasinya masih di bawah batas minimum umum Rp 10 juta.
                  Tetap boleh dilanjutkan, nanti dibantu carikan opsi yang
                  paling cocok.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleAjukanDenganEstimasi}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-bni-600 px-6 text-lg font-bold text-white shadow-card transition-colors hover:bg-bni-700 active:scale-[0.99]"
            >
              <span>Ajukan dengan estimasi ini</span>
              <ArrowRight weight="bold" className="size-5" aria-hidden="true" />
            </button>

            <Link
              href="/simulasi"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 text-base font-semibold text-navy-800 underline-offset-4 transition-colors hover:text-bni-700 hover:underline"
            >
              Butuh rincian biaya? Buka simulasi lengkap
              <ArrowRight weight="bold" className="size-4" aria-hidden="true" />
            </Link>
          </>
        )}
      </div>

      <p className="text-xs leading-relaxed text-stone-500">
        {LEGAL.indicativeNote}
      </p>
    </div>
  );
}
