"use client"

import Image from "next/image"

import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
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
} from "@/registry/components/lightbox"

export default function LightboxNextImageDemo() {
  return (
    <Lightbox>
      <div className="grid w-full max-w-xl grid-cols-2 gap-2">
        {PHOTOS.map((photo, index) => (
          <LightboxTrigger
            key={photo.src}
            index={index}
            className="aspect-4/3 overflow-hidden rounded-lg"
          >
            {({ imageRef }) => (
              <Image
                ref={imageRef}
                className="size-full rounded-[inherit] object-cover outline -outline-offset-1 outline-foreground/10"
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 640px) 288px, 50vw"
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
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="100vw"
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
          <LightboxCaption />
        </LightboxFooter>
      </LightboxContent>
    </Lightbox>
  )
}

const PHOTOS = [
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
