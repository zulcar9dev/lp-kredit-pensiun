"use client";

import { useMemo, useState } from "react";
import { Copy, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SITE_URL } from "@/lib/site";

// PRD v2: UTM builder murni client-side — tidak ada tabel campaign_settings.
// Susun parameter UTM untuk URL iklan Meta, lalu salin ke Ads Manager.

const FIELDS = [
  { key: "utm_source", label: "UTM Source", placeholder: "facebook, instagram" },
  { key: "utm_medium", label: "UTM Medium", placeholder: "paid, cpc" },
  {
    key: "utm_campaign",
    label: "UTM Campaign",
    placeholder: "kredit_pensiun_sept2026",
  },
  { key: "utm_content", label: "UTM Content", placeholder: "variant_a" },
  { key: "utm_term", label: "UTM Term", placeholder: "pensiunan_pns" },
] as const;

type UtmKey = (typeof FIELDS)[number]["key"];

export default function AdminCampaignsPage() {
  const [values, setValues] = useState<Record<UtmKey, string>>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  });
  const [copied, setCopied] = useState(false);

  const fullUrl = useMemo(() => {
    const params = new URLSearchParams();
    for (const field of FIELDS) {
      const value = values[field.key].trim();
      if (value) params.set(field.key, value);
    }
    const qs = params.toString();
    return qs ? `${SITE_URL}/?${qs}` : `${SITE_URL}/`;
  }, [values]);

  function updateField(key: UtmKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setCopied(false);
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin URL berikut:", fullUrl);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>UTM Link Builder</h1>
      </div>

      <div className="card">
        <p className="text-sm text-stone-600">
          Susun URL kampanye dengan parameter UTM. Setiap lead dan klik WhatsApp
          dari URL ini otomatis tercatat dengan sumber kampanyenya. Tempel URL
          hasil di kolom &quot;Destination URL&quot; saat membuat iklan Meta.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div className="form-group" key={field.key}>
              <label className="form-label" htmlFor={field.key}>
                {field.label}
              </label>
              <input
                id={field.key}
                type="text"
                className="form-input"
                placeholder={field.placeholder}
                value={values[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            URL Kampanye
          </p>
          <p className="mt-1 break-all font-mono text-sm text-navy-900">
            {fullUrl}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm mt-3"
            onClick={copyUrl}
          >
            {copied ? <CheckCircle weight="bold" /> : <Copy weight="bold" />}
            {copied ? "Tersalin" : "Copy URL"}
          </button>
        </div>

        <div className="mt-6 border-t border-stone-100 pt-4 text-xs leading-relaxed text-stone-500">
          <p>
            Tips: gunakan <code>utm_campaign</code> yang konsisten agar laporan
            performa per kampanye di dashboard akurat. <code>utm_content</code>{" "}
            berguna untuk membedakan varian kreatif (A/B).
          </p>
        </div>
      </div>
    </>
  );
}
