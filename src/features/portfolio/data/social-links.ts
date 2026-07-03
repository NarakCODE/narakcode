import type { SocialProfile } from "@/features/portfolio/types/social-links"

export const SOCIAL = {
  facebook: {
    title: "Facebook",
    handle: "ChAnnarak Lu",
    href: "https://web.facebook.com/Unforget.You",
    sameAs: true,
  },
  instagram: {
    title: "Instagram",
    handle: "channarak_lu",
    href: "https://www.instagram.com/channarak_lu/",
    sameAs: true,
  },
  github: {
    title: "GitHub",
    handle: "narakcode",
    href: "https://github.com/NarakCODE",
    sameAs: true,
  },
  khmercoder: {
    title: "KhmerCoders",
    handle: "narakcode",
    href: "https://khmercoder.com/@narakcode",
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
