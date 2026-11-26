"use client"

import { ImagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  createLightboxHandle,
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxZoom,
} from "@/registry/components/lightbox"

const handle = createLightboxHandle()

export default function LightboxHandleDemo() {
  return (
    <>
      <Button variant="outline" onClick={() => handle.open(0)}>
        <ImagesIcon />
        View {PHOTOS.length} photos
      </Button>

      <Lightbox handle={handle}>
        <LightboxContent aria-label="Photos of Cambodia">
          <LightboxSlides aria-label="Photos" aria-roledescription="carousel">
            {PHOTOS.map((photo, index) => (
              <LightboxSlide key={photo.src}>
                <LightboxItem
                  index={index}
                  caption={photo.caption}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${PHOTOS.length}`}
                >
                  <LightboxZoom>
                    <LightboxMedia width={photo.width} height={photo.height}>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        draggable={false}
                      />
                    </LightboxMedia>
                  </LightboxZoom>
                </LightboxItem>
              </LightboxSlide>
            ))}
          </LightboxSlides>

          <LightboxHeader>
            <LightboxClose />
          </LightboxHeader>

          <LightboxPrevious />
          <LightboxNext />

          <LightboxFooter>
            <div className="flex flex-col items-center gap-0.5">
              <LightboxCaption />
              <LightboxCounter>
                {({ current, total }) => `${current} of ${total}`}
              </LightboxCounter>
            </div>
          </LightboxFooter>
        </LightboxContent>
      </Lightbox>
    </>
  )
}

const PHOTOS = [
  {
    src: "/images/registry/cambodia/1.webp",
    alt: "Sunrise over Angkor Wat, the world’s largest religious monument and timeless emblem of Khmer architecture.",
    caption: "Angkor Wat, Siem Reap",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/2.webp",
    alt: "Crystal-clear turquoise waters, powdery white beaches, and tranquil tropical bays across Koh Rong island.",
    caption: "Koh Rong, Preah Sihanouk",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/3.webp",
    alt: "Serene riverside landscapes, fragrant pepper plantations, and the misty highlands of Bokor Mountain.",
    caption: "Kampot River, Kampot",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/4.webp",
    alt: "Gilded Khmer spires and classical palace architecture set beside lush tropical gardens in the capital.",
    caption: "Royal Palace, Phnom Penh",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/5.webp",
    alt: "Ancient stone towers carved with serene smiling faces rising above the emerald jungle of Angkor Thom.",
    caption: "Bayon Temple, Siem Reap",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/6.webp",
    alt: "Contemporary capital skyline glowing at twilight where the Tonle Sap and Mekong rivers meet.",
    caption: "Phnom Penh Riverfront",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/7.webp",
    alt: "The iconic lotus-shaped monument honoring Cambodia’s independence, illuminated in warm gold at dusk.",
    caption: "Independence Monument, Phnom Penh",
    width: 2048,
    height: 1152,
  },
]
