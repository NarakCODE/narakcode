import type { Metadata, Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://narakcode.dev",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

// Metadata merges shallowly, so a page's openGraph must spread this to keep it.
export const SITE_OPEN_GRAPH = {
  siteName: SITE_INFO.name,
  url: "/",
  type: "profile",
  locale: "en_US",
  firstName: USER.firstName,
  lastName: USER.lastName,
  username: USER.username,
  gender: USER.gender,
  images: [
    {
      url: SITE_INFO.ogImage,
      width: 1200,
      height: 630,
      alt: SITE_INFO.name,
    },
  ],
} satisfies Metadata["openGraph"]

export const LICENSE = {
  name: "MIT License",
  url: "https://github.com/NarakCODE/narakcode.dev/blob/main/LICENSE",
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Components",
    href: "/components",
  },
  {
    title: "Blocks",
    href: "/blocks",
  },
  {
    title: "Icons",
    href: "/icons" as Route,
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Vault",
    href: "/vault" as Route,
  },
  {
    title: "Stores",
    href: "/stores" as Route,
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const X_HANDLE = ""
export const GITHUB_USERNAME = SOCIAL.github.handle
export const SOURCE_CODE_GITHUB_REPO = "NarakCODE/narakcode.dev"
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/NarakCODE/narakcode.dev"

export const SPONSORSHIP_URL = "https://github.com/sponsors/narakcode"

export const UTM_PARAMS = {
  utm_source: "narakcode.dev",
}

export const CAMBODIA_HOLIDAYS = [
  "2025-01-01",
  "2025-01-07",
  "2025-03-08",
  "2025-04-14",
  "2025-04-15",
  "2025-04-16",
  "2025-05-01",
  "2025-05-08",
  "2025-05-12",
  "2025-05-14",
  "2025-06-18",
  "2025-09-21",
  "2025-09-22",
  "2025-09-23",
  "2025-09-24",
  "2025-10-15",
  "2025-10-29",
  "2025-11-04",
  "2025-11-05",
  "2025-11-06",
  "2025-11-09",
]
