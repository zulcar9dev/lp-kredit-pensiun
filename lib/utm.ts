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
      // BACKEND-3: gabung (merge), bukan timpa — kunjungan dengan 1 UTM
      // tak menghapus UTM lain yang sudah tersimpan. Nilai baru menang.
      const merged: UtmParams = { ...readStoredUtm(), ...collected };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
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

// --------------------------------------------
// fbc (Meta Click ID) — first-party, tahan lintas sesi
// --------------------------------------------

const FBC_KEY = "lp-pensiunku:fbc";

function buildFbc(fbclid: string): string {
  return `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
}

export function captureFbc(): void {
  if (typeof window === "undefined") return;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;
  try {
    window.localStorage.setItem(FBC_KEY, buildFbc(fbclid));
  } catch {
    // penyimpanan tidak tersedia, biarkan kosong
  }
}

export function readStoredFbc(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(FBC_KEY);
  } catch {
    return null;
  }
}

// Nilai cookie _fbp dari Meta Pixel (diteruskan ke CAPI untuk Advanced Matching)
export function readFbpCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
