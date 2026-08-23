export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const STORAGE_KEY = "lp-pensiunku:utm";

export function captureUtm(): UtmParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const collected: UtmParams = {};
  const keys: (keyof UtmParams)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  for (const key of keys) {
    const value = params.get(key);
    if (value) collected[key] = value;
  }

  if (Object.keys(collected).length > 0) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
    } catch {
      // penyimpanan tidak tersedia, biarkan kosong
    }
  }

  return readStoredUtm();
}

export function readStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
