"use client"

import { cn } from "@/lib/utils"
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
  LightboxThumbnail,
  LightboxThumbnailStrip,
  LightboxThumbnailStripTrack,
  LightboxTrigger,
  LightboxZoom,
} from "@/registry/components/lightbox"

export default function LightboxThumbnailsDemo() {
  return (
    <Lightbox>
      <div className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-3">
        {PHOTOS.map((photo, index) => (
          <LightboxTrigger
            key={photo.src}
            index={index}
            className={cn(
              "overflow-hidden rounded-lg",
              index === 0 && "col-span-2 sm:col-span-3"
            )}
          >
            {({ imageRef }) => (
              <img
                ref={imageRef}
                className="block h-auto w-full rounded-[inherit] outline -outline-offset-1 outline-foreground/10"
                // The wide cover tile needs the full-size image to stay sharp.
                src={index === 0 ? photo.src : photo.thumbnail}
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
          <LightboxCaption />
          <LightboxThumbnailStrip>
            <LightboxThumbnailStripTrack aria-label="Photo thumbnails">
              {PHOTOS.map((photo, index) => (
                <LightboxThumbnail key={photo.src} index={index}>
                  <img src={photo.thumbnail} alt={photo.caption} />
                </LightboxThumbnail>
              ))}
            </LightboxThumbnailStripTrack>
          </LightboxThumbnailStrip>
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
    src: "/images/registry/cambodia/2.webp",
    thumbnail: "/images/registry/cambodia/2-640w.webp",
    alt: "Crystal-clear turquoise waters, powdery white beaches, and tranquil tropical bays across Koh Rong island.",
    caption: "Koh Rong, Preah Sihanouk",
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
    src: "/images/registry/cambodia/4.webp",
    thumbnail: "/images/registry/cambodia/4-640w.webp",
    alt: "Gilded Khmer spires and classical palace architecture set beside lush tropical gardens in the capital.",
    caption: "Royal Palace, Phnom Penh",
    width: 2048,
    height: 1152,
  },
  {
    src: "/images/registry/cambodia/5.webp",
    thumbnail: "/images/registry/cambodia/5-640w.webp",
    alt: "Ancient stone towers carved with serene smiling faces rising above the emerald jungle of Angkor Thom.",
    caption: "Bayon Temple, Siem Reap",
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
