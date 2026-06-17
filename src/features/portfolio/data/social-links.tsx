import { Icons } from "@/components/icons"
import type { SocialLink } from "@/features/portfolio/types/social-links"

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "x",
    icon: <Icons.x />,
    title: "X",
    handle: "@iamncdai",
    href: "https://x.com/iamncdai",
  },
  {
    name: "github",
    icon: <Icons.github />,
    title: "GitHub",
    handle: "ncdai",
    href: "https://github.com/ncdai",
  },
  {
    name: "linkedin",
    icon: <Icons.linkedin />,
    title: "LinkedIn",
    handle: "ncdai",
    href: "https://linkedin.com/in/ncdai",
  },
  {
    name: "dailydotdev",
    icon: <Icons.dailydotdev />,
    title: "daily.dev",
    handle: "@ncdai",
    href: "https://app.daily.dev/ncdai",
  },
  {
    name: "discord",
    icon: <Icons.discord />,
    title: "Discord",
    handle: "ncdai",
    href: "https://discord.com/users/1186630645443739651",
  },
  {
    name: "youtube",
    icon: <Icons.youtube />,
    title: "YouTube",
    handle: "@ncdai",
    href: "https://www.youtube.com/@ncdai",
  },
]

export function getSocialLinkByName(name: string) {
  return SOCIAL_LINKS.find((link) => link.name === name)
}
