"use client"

import { useState } from "react"

import {
  AppleAccordionClose,
  AppleAccordionContent,
  AppleAccordionItem,
  AppleAccordionList,
  AppleAccordionNext,
  AppleAccordionPrevious,
  AppleAccordionRoot,
  AppleAccordionTrigger,
  AppleAccordionTriggerIcon,
} from "@/registry/components/apple-accordion"

export default function AppleAccordionDemo() {
  const [value, setValue] = useState<string | null>(null)
  const image = ITEMS.find((item) => item.value === value)?.image ?? COVER

  return (
    <AppleAccordionRoot
      value={value}
      onValueChange={setValue}
      className="mx-auto h-176 max-w-6xl overflow-hidden rounded-4xl bg-background"
    >
      {[COVER, ...ITEMS.map((item) => item.image)].map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          data-current={src === image ? "" : undefined}
          className="absolute inset-0 -z-10 size-full object-cover opacity-0 transition-opacity duration-500 ease-in-out data-current:opacity-100"
        />
      ))}

      <div className="flex h-full items-center gap-4 px-4 sm:gap-8 sm:px-8">
        <div className="flex flex-col gap-5">
          <AppleAccordionPrevious aria-label="Previous place" />
          <AppleAccordionNext aria-label="Next place" />
        </div>

        <AppleAccordionList aria-label="Places in Cambodia">
          {ITEMS.map((item) => (
            <AppleAccordionItem key={item.value} value={item.value}>
              <AppleAccordionTrigger>
                <AppleAccordionTriggerIcon />
                {item.title}
              </AppleAccordionTrigger>
              <AppleAccordionContent>
                <p>
                  <span className="font-medium">{item.title}.</span>{" "}
                  {item.description}
                </p>
              </AppleAccordionContent>
            </AppleAccordionItem>
          ))}
        </AppleAccordionList>
      </div>

      <AppleAccordionClose className="absolute inset-e-4 top-4 sm:inset-e-6 sm:top-6" />
    </AppleAccordionRoot>
  )
}

const COVER = "/images/registry/cambodia/5.webp"

const ITEMS = [
  {
    value: "siem-reap",
    title: "Siem Reap",
    description:
      "Sunrise over Angkor Wat, the world’s largest religious monument and timeless emblem of Khmer architecture.",
    image: "/images/registry/cambodia/1.webp",
  },
  {
    value: "preah-sihanouk",
    title: "Preah Sihanouk",
    description:
      "Crystal-clear turquoise waters, powdery white beaches, and tranquil tropical bays across Koh Rong island.",
    image: "/images/registry/cambodia/2.webp",
  },
  {
    value: "kampot",
    title: "Kampot",
    description:
      "Serene riverside landscapes, fragrant pepper plantations, and the misty highlands of Bokor Mountain.",
    image: "/images/registry/cambodia/3.webp",
  },
  {
    value: "phnom-penh",
    title: "Phnom Penh",
    description:
      "Gilded Khmer spires and classical palace architecture set beside lush tropical gardens in the capital.",
    image: "/images/registry/cambodia/4.webp",
  },
  {
    value: "chaktomuk-riverfront",
    title: "Chaktomuk Riverfront",
    description:
      "Contemporary capital skyline glowing at twilight where the Tonle Sap and Mekong rivers meet.",
    image: "/images/registry/cambodia/6.webp",
  },
  {
    value: "independence-monument",
    title: "Independence Monument",
    description:
      "The iconic lotus-shaped monument honoring Cambodia’s independence, illuminated in warm gold at dusk.",
    image: "/images/registry/cambodia/7.webp",
  },
]
