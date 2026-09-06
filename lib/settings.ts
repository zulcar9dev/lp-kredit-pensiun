import {
  SITE_NAME,
  WA_NUMBER_INTL,
  WA_NUMBER_DISPLAY,
  WA_PREFILLED_MESSAGE,
} from "@/lib/constants";
import { getInsforgeAdmin } from "@/lib/insforge";

export interface AppSettings {
  siteTitle: string;
  waNumberIntl: string;
  waNumberDisplay: string;
  waGreeting: string;
}

export async function getAppSettings(): Promise<AppSettings> {
  const { data, error } = await getInsforgeAdmin().database
    .from("app_settings")
    .select("*");

  if (error) {
    console.error("getAppSettings error:", error);
  }

  const settings = data ?? [];

  function getSetting(key: string, fallback: string) {
    return settings.find((s) => s.setting_key === key)?.setting_value || fallback;
  }

  return {
    siteTitle: getSetting("site_title", SITE_NAME),
    waNumberIntl: getSetting("wa_number", WA_NUMBER_INTL),
    waNumberDisplay: getSetting("wa_number_display", WA_NUMBER_DISPLAY),
    waGreeting: getSetting("wa_greeting", WA_PREFILLED_MESSAGE),
  };
}
