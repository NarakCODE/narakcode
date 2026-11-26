"use client"

import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxSlide,
  LightboxSlides,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
} from "@/registry/components/lightbox"

export default function LightboxSingleDemo() {
  return (
    <Lightbox>
      <figure className="w-full max-w-xs">
        <LightboxTrigger
          index={0}
          className="w-full overflow-hidden rounded-xl"
        >
          {({ imageRef }) => (
            <img
              ref={imageRef}
              className="block h-auto w-full rounded-[inherit] outline -outline-offset-1 outline-foreground/10"
              src={IMAGE.src}
              alt={IMAGE.alt}
              width={IMAGE.width}
              height={IMAGE.height}
            />
          )}
        </LightboxTrigger>
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {IMAGE.caption}
        </figcaption>
      </figure>

      <LightboxContent aria-label={IMAGE.caption}>
        <LightboxSlides>
          <LightboxSlide>
            <LightboxItem index={0} caption={IMAGE.caption}>
              <LightboxZoom maxZoom={4} scrollToZoom>
                <LightboxMedia width={IMAGE.width} height={IMAGE.height}>
                  <img
                    src={IMAGE.src}
                    alt={IMAGE.alt}
                    width={IMAGE.width}
                    height={IMAGE.height}
                    draggable={false}
                  />
                </LightboxMedia>
              </LightboxZoom>
            </LightboxItem>
          </LightboxSlide>
        </LightboxSlides>

        <LightboxHeader>
          <LightboxZoomOut />
          <LightboxZoomIn />
          <LightboxClose />
        </LightboxHeader>

        <LightboxFooter>
          <LightboxCaption />
        </LightboxFooter>
      </LightboxContent>
    </Lightbox>
  )
}

const IMAGE = {
  src: "/images/registry/lightbox-single.webp",
  alt: "Sunlit sandstone colonnade and carved stone doorway gallery at Angkor in Siem Reap, Cambodia",
  caption: "Angkor sandstone gallery, Siem Reap",
  width: 1000,
  height: 1500,
}
