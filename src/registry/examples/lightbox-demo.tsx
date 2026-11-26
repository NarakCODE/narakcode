"use client"

import {
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
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
} from "@/registry/components/lightbox"

export default function LightboxDemo() {
  return (
    <Lightbox>
      <div className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
        {PHOTOS.map((photo, index) => (
          <LightboxTrigger
            key={photo.src}
            index={index}
            className="aspect-square overflow-hidden rounded-lg"
          >
            {({ imageRef }) => (
              <img
                ref={imageRef}
                className="size-full rounded-[inherit] object-cover outline -outline-offset-1 outline-foreground/10"
                src={photo.thumbnail}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
              />
            )}
          </LightboxTrigger>
        ))}
      </div>

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
          <LightboxZoomOut />
          <LightboxZoomIn />
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
  )
}

const PHOTOS = [
  {
    src: "/images/registry/cambodia/1.webp",
    thumbnail: "/images/registry/cambodia/1-640w.webp",
    alt: "Sunrise over Angkor Wat, the world’s largest religious monument and timeless emblem of Khmer architecture.",
    caption: "Angkor Wat, Siem Reap",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/3.webp",
    thumbnail: "/images/registry/cambodia/3-640w.webp",
    alt: "Serene riverside landscapes, fragrant pepper plantations, and the misty highlands of Bokor Mountain.",
    caption: "Kampot River, Kampot",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/6.webp",
    thumbnail: "/images/registry/cambodia/6-640w.webp",
    alt: "Contemporary capital skyline glowing at twilight where the Tonle Sap and Mekong rivers meet.",
    caption: "Phnom Penh Riverfront",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/7.webp",
    thumbnail: "/images/registry/cambodia/7-640w.webp",
    alt: "The iconic lotus-shaped monument honoring Cambodia’s independence, illuminated in warm gold at dusk.",
    caption: "Independence Monument, Phnom Penh",
    width: 2048,
    height: 1152,
  },
]
