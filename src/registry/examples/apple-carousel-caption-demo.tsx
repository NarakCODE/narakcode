import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/registry/components/apple-carousel"

export default function AppleCarouselCaptionDemo() {
  return (
    <AppleCarouselRoot duration={3600}>
      <AppleCarouselContent>
        {ITEMS.map((item) => (
          // The caption always sits on a photo, so the card resolves the dark
          // tokens in either theme.
          <AppleCarouselItem key={item.image} className="dark @max-3xl:h-96">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 size-full object-cover select-none"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/70 via-background/30 to-transparent"
            />
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 flex items-center gap-4 px-12 pb-10 text-xl/6 text-foreground",
                "opacity-36 transition-opacity duration-150 ease-out in-data-current:opacity-100 in-data-current:duration-400",
                "@max-5xl:gap-3 @max-5xl:px-6 @max-5xl:pb-6 @max-5xl:text-base/5",
                "@max-3xl:flex-col @max-3xl:px-6 @max-3xl:text-center"
              )}
            >
              <Button
                className="rounded-full"
                nativeButton={false}
                render={
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Learn more
              </Button>
              <p className="text-pretty text-shadow-sm">
                <span className="font-semibold after:px-2 after:opacity-50 after:content-['•'/''] @max-3xl:block @max-3xl:after:hidden">
                  {item.title}
                </span>
                {item.description}
              </p>
            </div>
          </AppleCarouselItem>
        ))}
      </AppleCarouselContent>

      <AppleCarouselControls>
        <AppleCarouselTabList aria-label="Places in Cambodia">
          {ITEMS.map((item) => (
            <AppleCarouselTab key={item.image}>{item.title}</AppleCarouselTab>
          ))}
        </AppleCarouselTabList>
        <AppleCarouselPlayButton />
      </AppleCarouselControls>
    </AppleCarouselRoot>
  )
}

const ITEMS = [
  {
    title: "Siem Reap",
    description:
      "Sunrise over Angkor Wat, the world’s largest religious monument and timeless emblem of Khmer architecture.",
    image: "/images/registry/cambodia/1.webp",
    href: "https://en.wikipedia.org/wiki/Angkor_Wat",
  },
  {
    title: "Preah Sihanouk",
    description:
      "Crystal-clear turquoise waters, powdery white beaches, and tranquil tropical bays across Koh Rong island.",
    image: "/images/registry/cambodia/2.webp",
    href: "https://en.wikipedia.org/wiki/Koh_Rong",
  },
  {
    title: "Kampot",
    description:
      "Serene riverside landscapes, fragrant pepper plantations, and the misty highlands of Bokor Mountain.",
    image: "/images/registry/cambodia/3.webp",
    href: "https://en.wikipedia.org/wiki/Kampot_province",
  },
  {
    title: "Phnom Penh",
    description:
      "Gilded Khmer spires and classical palace architecture set beside lush tropical gardens in the capital.",
    image: "/images/registry/cambodia/4.webp",
    href: "https://en.wikipedia.org/wiki/Royal_Palace_of_Cambodia",
  },
  {
    title: "Angkor Thom",
    description:
      "Ancient stone towers carved with serene smiling faces rising above the emerald jungle of Angkor Thom.",
    image: "/images/registry/cambodia/5.webp",
    href: "https://en.wikipedia.org/wiki/Bayon",
  },
  {
    title: "Chaktomuk Riverfront",
    description:
      "Contemporary capital skyline glowing at twilight where the Tonle Sap and Mekong rivers meet.",
    image: "/images/registry/cambodia/6.webp",
    href: "https://en.wikipedia.org/wiki/Phnom_Penh",
  },
  {
    title: "Independence Monument",
    description:
      "The iconic lotus-shaped monument honoring Cambodia’s independence, illuminated in warm gold at dusk.",
    image: "/images/registry/cambodia/7.webp",
    href: "https://en.wikipedia.org/wiki/Independence_Monument_(Cambodia)",
  },
]
