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
// fbc (Meta Click ID) — first-party, tahan lintas sesi (PRD §4.1:
// "first-party cookie/localStorage"). Umur 90 hari (umur klik Meta);
// nilai basi tidak dikirim ke CAPI.
// --------------------------------------------

const FBC_KEY = "lp-pensiunku:fbc";
const FBC_COOKIE = "_fbc_lp";
const FBC_MAX_AGE_DAYS = 90;

function buildFbc(fbclid: string): string {
  return `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
}

function fbcTimestamp(fbc: string): number | null {
  const parts = fbc.split(".");
  const ts = Number(parts[2]);
  return parts.length >= 4 && Number.isFinite(ts) ? ts : null;
}

function isFbcFresh(fbc: string): boolean {
  const ts = fbcTimestamp(fbc);
  if (ts === null) return false;
  return Date.now() - ts * 1000 < FBC_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

function writeFbcCookie(value: string): void {
  try {
    const maxAge = FBC_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie =
      `${FBC_COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  } catch {
    // cookie diblokir — localStorage tetap jadi cadangan
  }
}

function readFbcCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${FBC_COOKIE}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function captureFbc(): void {
  if (typeof window === "undefined") return;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;
  try {
    const value = buildFbc(fbclid);
    window.localStorage.setItem(FBC_KEY, value);
    writeFbcCookie(value);
  } catch {
    // penyimpanan tidak tersedia, biarkan kosong
  }
}

export function readStoredFbc(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromCookie = readFbcCookie();
    if (fromCookie && isFbcFresh(fromCookie)) return fromCookie;
    const fromStorage = window.localStorage.getItem(FBC_KEY);
    if (fromStorage && isFbcFresh(fromStorage)) {
      // Segarkan cookie dari localStorage bila cookie hilang
      writeFbcCookie(fromStorage);
      return fromStorage;
    }
    return null;
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
