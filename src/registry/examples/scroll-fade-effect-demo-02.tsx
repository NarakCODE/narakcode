import Image from "next/image"

import { ScrollFadeEffect } from "@/registry/components/scroll-fade-effect"

export default function ScrollFadeEffectHorizontalDemo() {
  return (
    <div className="rounded-lg border">
      <ScrollFadeEffect className="w-72 sm:w-96" orientation="horizontal">
        <div className="flex w-max gap-4 p-4">
          {places.map((place) => (
            <figure key={place.title} className="shrink-0">
              <Image
                src={place.image}
                alt={place.title}
                className="aspect-3/4 h-48 w-36 rounded-sm object-cover"
                width={300}
                height={400}
              />

              <figcaption className="pt-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {place.title}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </ScrollFadeEffect>
    </div>
  )
}

interface Place {
  title: string
  image: string
}

const places: Place[] = [
  {
    title: "Angkor Wat, Siem Reap",
    image: "/images/registry/cambodia/1.webp",
  },
  {
    title: "Koh Rong, Preah Sihanouk",
    image: "/images/registry/cambodia/2.webp",
  },
  {
    title: "Royal Palace, Phnom Penh",
    image: "/images/registry/cambodia/4.webp",
  },
]
