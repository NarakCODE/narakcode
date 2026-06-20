import { Icons } from "@/components/icons"
import type { SocialName } from "@/features/portfolio/data/social-links"

/**
 * Presentation binding for social profiles. Kept separate from the social
 * data so the data layer stays JSX-free. Keyed by `SocialName` so it stays
 * exhaustive with the registry.
 */
export const SOCIAL_ICONS: Record<SocialName, React.JSX.Element> = {
  x: <Icons.x />,
  github: <Icons.github />,
  linkedin: <Icons.linkedin />,
  dailydotdev: <Icons.dailydotdev />,
  discord: <Icons.discord />,
  youtube: <Icons.youtube />,
}
