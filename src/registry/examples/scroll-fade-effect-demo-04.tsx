import Image from "next/image"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea
      className={cn(
        "w-72 rounded-lg border whitespace-nowrap sm:w-96",
        "**:data-[slot=scroll-area-viewport]:scroll-fade-effect-x"
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-left:8px]",
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-right:8px]"
      )}
    >
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
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
