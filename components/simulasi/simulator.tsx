"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { CATEGORY_LABELS, SIM_PARAMS, formatTenorID, type SimCategory } from "@/lib/simulasi/constants";
import {
  computeAgeDetail,
  getMaxTenorMonths,
  getNearestAgeMonths,
  simulate,
} from "@/lib/simulasi/engine";
import { buildWaSimulationMessage } from "@/lib/wa";
import { saveLeadDraft } from "@/lib/draft";
import { formatRupiah } from "@/lib/format";
import { LEGAL, LOAN_MAX, LOAN_MIN, LOAN_STEP } from "@/lib/constants";
import { FieldError, inputClass, labelClass } from "@/components/field";
import { WaButton } from "@/components/wa-button";

const TENOR_CHIPS = [36, 60, 84, 120, 180];

function parseDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 12);
}

function formatGrouped(digits: string): string {
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

export function Simulator() {
  const [category, setCategory] = useState<SimCategory>("purna");
  const [incomeDigits, setIncomeDigits] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [retirementDate, setRetirementDate] = useState("");
  const [tenorMonths, setTenorMonths] = useState(60);

  const today = useMemo(() => new Date(), []);

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

  const retirementMissing =
    category === "pra_purna" && retirementDate.trim() === "";
  const retirementInvalid =
    !retirementMissing &&
    category === "pra_purna" &&
    new Date(retirementDate).getTime() <= today.getTime();
  const retirementOk =
    category === "purna" || (!retirementMissing && !retirementInvalid);

  const effectiveTenorMonths =
    maxTenorMonths !== null ? Math.min(tenorMonths, maxTenorMonths) : tenorMonths;

  const income = Number(incomeDigits || "0");
  const ready =
    income > 0 &&
    birth !== null &&
    !isNaN(birth.getTime()) &&
    retirementOk &&
    maxTenorMonths !== null &&
    maxTenorMonths > 0;

  const result = useMemo(() => {
    if (!ready) return null;
    return simulate({
      category,
      income,
      birthDate,
      retirementDate:
        category === "pra_purna" ? retirementDate : undefined,
      tenorMonths: effectiveTenorMonths,
    });
  }, [
    ready,
    category,
    income,
    birthDate,
    retirementDate,
    effectiveTenorMonths,
  ]);

  const missingItems: string[] = [];
  if (income <= 0) missingItems.push("pendapatan pensiun per bulan");
  if (!birth || isNaN(birth.getTime()))
    missingItems.push("tanggal lahir Bapak/Ibu");
  if (retirementMissing)
    missingItems.push("tanggal rencana pensiun");

  const maturityYears = result
    ? Math.floor(result.maturityAgeMonths / 12)
    : 0;
  const maturityRestMonths = result
    ? Math.round(result.maturityAgeMonths % 12)
    : 0;

  const waMessage =
    result && result.eligible
      ? buildWaSimulationMessage({
          categoryLabel: CATEGORY_LABELS[category],
          income,
          tenorMonths: effectiveTenorMonths,
          plafonMaks: result.plafonMaks,
          angsuran: result.angsuran,
        })
      : undefined;

  function handleLanjutFormulir() {
    if (!result || !result.eligible) return;
    const clamped = Math.min(
      LOAN_MAX,
      Math.max(LOAN_MIN, Math.floor(result.plafonMaks / LOAN_STEP) * LOAN_STEP),
    );
    saveLeadDraft({ loanAmount: clamped });
  }

  return (
    <section aria-labelledby="simulasi-title" className="container-page pb-16 pt-10 md:pb-24 md:pt-14">
      <h1 id="simulasi-title" className="max-w-[30ch] text-3xl tracking-tight sm:text-4xl">
        Hitung estimasi plafon dan cicilan kredit pensiun.
      </h1>
      <p className="mt-4 max-w-[56ch] text-stone-700">
        Isi tiga data saja, hasilnya langsung muncul. Tanpa daftar akun dan
        tanpa mengisi data pribadi.
      </p>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-card md:p-7">
          <fieldset>
            <legend className={`${labelClass} mb-1.5`}>Status Saat Ini</legend>
            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-stone-100 p-1.5">
              {(Object.keys(CATEGORY_LABELS) as SimCategory[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={category === key}
                  onClick={() => setCategory(key)}
                  className={`min-h-[48px] rounded-xl px-3 text-base font-bold transition-colors ${
                    category === key
                      ? "bg-white text-navy-900 shadow-card"
                      : "text-stone-600 hover:text-navy-900"
                  }`}
                >
                  {CATEGORY_LABELS[key]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {category === "pra_purna"
                ? "Untuk yang masih bekerja dan punya rencana pensiun di kemudian hari."
                : "Untuk yang sudah menerima dana pensiun."}
            </p>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="sim-income" className={`${labelClass} mb-1.5`}>
              Pendapatan Pensiun per Bulan
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-stone-500"
              >
                Rp
              </span>
              <input
                id="sim-income"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Contoh: 3.500.000"
                value={formatGrouped(incomeDigits)}
                onChange={(event) =>
                  setIncomeDigits(parseDigits(event.target.value))
                }
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="sim-birth" className={`${labelClass} mb-1.5`}>
                Tanggal Lahir
              </label>
              <input
                id="sim-birth"
                type="date"
                value={birthDate}
                max={today.toISOString().slice(0, 10)}
                onChange={(event) => setBirthDate(event.target.value)}
                aria-invalid={!!birthDate && !ageDetail}
                className={inputClass}
              />
              {ageDetail && (
                <p className="mt-2 text-sm font-semibold text-bni-700">
                  Usia saat ini: {ageDetail.years} tahun {ageDetail.months}{" "}
                  bulan
                </p>
              )}
            </div>

            {category === "pra_purna" && (
              <div>
                <label htmlFor="sim-retire" className={`${labelClass} mb-1.5`}>
                  Rencana Tanggal Pensiun
                </label>
                <input
                  id="sim-retire"
                  type="date"
                  value={retirementDate}
                  min={new Date(today.getTime() + 86400000)
                    .toISOString()
                    .slice(0, 10)}
                  onChange={(event) => setRetirementDate(event.target.value)}
                  aria-invalid={retirementInvalid}
                  className={inputClass}
                />
                <FieldError
                  message={
                    retirementInvalid
                      ? "Tanggal pensiun harus setelah hari ini."
                      : undefined
                  }
                />
              </div>
            )}
          </div>

          {maxTenorMonths !== null && maxTenorMonths > 0 ? (
            <div className="mt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className={labelClass}>Lama Pinjaman (Tenor)</span>
                <output className="text-lg font-extrabold tabular-nums text-bni-700">
                  {formatTenorID(effectiveTenorMonths)}
                </output>
              </div>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pilihan cepat tenor">
                {TENOR_CHIPS.filter((chip) => chip <= maxTenorMonths).map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      aria-pressed={effectiveTenorMonths === chip}
                      onClick={() => setTenorMonths(chip)}
                      className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition-colors active:scale-[0.98] ${
                        effectiveTenorMonths === chip
                          ? "bg-bni-600 text-white shadow-card"
                          : "border-2 border-stone-200 text-navy-800 hover:border-bni-300"
                      }`}
                    >
                      {Math.floor(chip / 12)} tahun
                    </button>
                  ),
                )}
              </div>
              <input
                type="range"
                aria-label="Atur tenor dalam bulan"
                min={12}
                max={maxTenorMonths}
                step={12}
                value={effectiveTenorMonths}
                onChange={(event) => setTenorMonths(Number(event.target.value))}
                className="mt-4 h-2 w-full cursor-pointer accent-bni-600"
              />
              <div className="mt-1.5 flex justify-between text-sm font-medium text-stone-500">
                <span>1 tahun</span>
                <span>Maks {formatTenorID(maxTenorMonths)}</span>
              </div>
            </div>
          ) : (
            nearestAgeMonths !== null && (
              <div
                role="status"
                className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800"
              >
                Batas usia pembiayaan sudah tercapai, sehingga tidak ada tenor
                yang tersedia.
              </div>
            )
          )}
        </div>

        <aside aria-live="polite" className="lg:sticky lg:top-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-card md:p-7">
            {!result ? (
              <div className="py-10 text-center">
                <Calculator
                  weight="duotone"
                  className="mx-auto size-14 text-stone-300"
                  aria-hidden="true"
                />
                <p className="mt-4 font-bold text-navy-900">
                  Hasil simulasi akan muncul di sini.
                </p>
                {missingItems.length > 0 && (
                  <p className="mx-auto mt-2 max-w-[40ch] text-stone-700">
                    Lengkapi dulu{" "}
                    <span className="font-bold text-bni-700">
                      {missingItems.join(" dan ")}
                    </span>{" "}
                    di panel sebelah.
                  </p>
                )}
              </div>
            ) : !result.eligible ? (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <Warning
                  weight="fill"
                  className="mt-0.5 size-6 shrink-0 text-red-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-bold text-navy-900">
                    Belum bisa dihitung dengan data ini.
                  </p>
                  <p className="mt-1 text-stone-700">{result.error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-navy-900 p-5 text-white">
                    <p className="text-sm font-semibold text-white/70">
                      Perkiraan Plafon Maksimal
                    </p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">
                      {formatRupiah(result.plafonMaks)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-bni-600 p-5 text-white">
                    <p className="text-sm font-semibold text-white/70">
                      Angsuran per Bulan
                    </p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">
                      {formatRupiah(result.angsuran)}
                    </p>
                  </div>
                </div>

                <dl className="mt-5 divide-y divide-stone-100">
                  {[
                    ["Suku bunga indikatif", `${result.ratePercent}% per tahun`],
                    [
                      "Usia saat lunas",
                      `${maturityYears} tahun ${maturityRestMonths} bulan`,
                    ],
                    [
                      `Biaya provisi (${SIM_PARAMS.propisiRatePercent}%)`,
                      formatRupiah(result.biayaPropisi),
                    ],
                    [
                      "Biaya tata laksana",
                      formatRupiah(result.biayaTataLaksana),
                    ],
                    [
                      "Biaya administrasi",
                      formatRupiah(result.biayaAdministrasi),
                    ],
                    ["Total potongan awal", formatRupiah(result.totalBiaya)],
                    [
                      "Saldo diblokir wajib",
                      formatRupiah(result.blokiranWajib),
                    ],
                    ...(category === "pra_purna" && result.blokiranPraPurna > 0
                      ? ([
                          [
                            `Blokir masa kerja tersisa (${result.sisaBulanAktif} bulan)`,
                            formatRupiah(result.blokiranPraPurna),
                          ],
                        ] as [string, string][])
                      : []),
                  ].map(([term, value]) => (
                    <div
                      key={term}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="text-stone-700">{term}</dt>
                      <dd className="font-bold tabular-nums text-navy-900">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-bni-200 bg-bni-50 p-4">
                  <p className="font-bold text-navy-900">
                    Perkiraan dana bersih diterima
                  </p>
                  <p className="text-xl font-extrabold tabular-nums text-bni-700">
                    {formatRupiah(Math.max(0, result.danaDiterima))}
                  </p>
                </div>

                {result.plafonMaks < LOAN_MIN && (
                  <div
                    role="status"
                    className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm"
                  >
                    <Warning
                      weight="fill"
                      className="mt-0.5 size-5 shrink-0 text-amber-500"
                      aria-hidden="true"
                    />
                    <p className="text-amber-800">
                      Estimasi plafon di bawah batas minimum umum Rp 10 juta.
                      Coba naikkan tenor atau sesuaikan pendapatan.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <WaButton
                    size="lg"
                    label="Konsultasi Hasil Ini"
                    message={waMessage}
                    className="w-full"
                  />
                  <Link
                    href="/#ajukan"
                    onClick={handleLanjutFormulir}
                    className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl border-2 border-navy-200 px-6 text-lg font-bold text-navy-800 transition-colors hover:border-navy-400 active:scale-[0.99]"
                  >
                    <span>Lanjut Isi Formulir</span>
                    <ArrowRight weight="bold" className="size-5" aria-hidden="true" />
                  </Link>
                </div>
              </>
            )}

            <p className="mt-6 text-xs leading-relaxed text-stone-500">
              {LEGAL.indicativeNote} {LEGAL.generalDisclaimer}{" "}
              {LEGAL.agentDisclaimer}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
