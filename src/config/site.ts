import { USER } from "@/data/user";

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://narakcode.dev",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const SOURCE_CODE_GITHUB_URL = "https://github.com/NarakCODE";

export const CAMBODIA_HOLIDAYS = [
  "2025-01-01", // International New Year's Day
  "2025-01-07", // Victory Day over Genocide
  "2025-03-08", // International Women's Day
  "2025-04-14", // Khmer New Year Day 1
  "2025-04-15", // Khmer New Year Day 2
  "2025-04-16", // Khmer New Year Day 3
  "2025-05-01", // International Labor Day
  "2025-05-08", // Royal Ploughing Ceremony (Chat Preah Nengkal) - Date can vary slightly based on lunar calendar
  "2025-05-12", // Visak Bochea Day (Buddha's Birth, Enlightenment, and Parinirvana)
  "2025-05-14", // King Norodom Sihamoni's Birthday
  "2025-06-18", // Queen Mother Norodom Monineath Sihanouk's Birthday
  "2025-09-21", // Pchum Ben Day 1 (Ancestors' Day)
  "2025-09-22", // Pchum Ben Day 2
  "2025-09-23", // Pchum Ben Day 3
  "2025-09-24", // Constitution Day
  "2025-10-15", // Commemoration Day of King Father Norodom Sihanouk
  "2025-10-29", // King Norodom Sihamoni's Coronation Day
  "2025-11-04", // Water Festival Day 1 (Bon Om Touk) - Dates can vary & event may be suspended
  "2025-11-05", // Water Festival Day 2 (Bon Om Touk)
  "2025-11-06", // Water Festival Day 3 (Bon Om Touk)
  "2025-11-09", // Independence Day (often falls within or near Water Festival)
];

export const UTM_PARAMS = {
  utm_source: "narakcode.dev",
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};
