import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/registry/components/apple-carousel"

export default function AppleCarouselDemo() {
  return (
    <AppleCarouselRoot duration={3600}>
      <AppleCarouselContent>
        {ITEMS.map((item) => (
          // The link is the panel's first focusable element, so the panel
          // itself leaves the tab order.
          <AppleCarouselItem
            key={item.image}
            tabIndex={-1}
            className="@max-3xl:h-96"
          >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block size-full rounded-[inherit] select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </a>
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
    image: "/images/registry/cambodia/1.webp",
    href: "https://en.wikipedia.org/wiki/Angkor_Wat",
  },
  {
    title: "Preah Sihanouk",
    image: "/images/registry/cambodia/2.webp",
    href: "https://en.wikipedia.org/wiki/Koh_Rong",
  },
  {
    title: "Kampot",
    image: "/images/registry/cambodia/3.webp",
    href: "https://en.wikipedia.org/wiki/Kampot_province",
  },
  {
    title: "Phnom Penh",
    image: "/images/registry/cambodia/4.webp",
    href: "https://en.wikipedia.org/wiki/Royal_Palace_of_Cambodia",
  },
  {
    title: "Angkor Thom",
    image: "/images/registry/cambodia/5.webp",
    href: "https://en.wikipedia.org/wiki/Bayon",
  },
  {
    title: "Chaktomuk Riverfront",
    image: "/images/registry/cambodia/6.webp",
    href: "https://en.wikipedia.org/wiki/Phnom_Penh",
  },
  {
    title: "Independence Monument",
    image: "/images/registry/cambodia/7.webp",
    href: "https://en.wikipedia.org/wiki/Independence_Monument_(Cambodia)",
  },
]
