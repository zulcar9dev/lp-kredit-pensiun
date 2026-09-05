import {
  SITE_NAME,
  WA_NUMBER_INTL,
  WA_NUMBER_DISPLAY,
  WA_PREFILLED_MESSAGE,
} from "@/lib/constants";

export interface AppSettings {
  siteTitle: string;
  waNumberIntl: string;
  waNumberDisplay: string;
  waGreeting: string;
}

export function getAppSettings(): AppSettings {
  return {
    siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE || SITE_NAME,
    waNumberIntl: process.env.NEXT_PUBLIC_WA_NUMBER || WA_NUMBER_INTL,
    waNumberDisplay:
      process.env.NEXT_PUBLIC_WA_NUMBER_DISPLAY || WA_NUMBER_DISPLAY,
    waGreeting: process.env.NEXT_PUBLIC_WA_GREETING || WA_PREFILLED_MESSAGE,
  };
}
