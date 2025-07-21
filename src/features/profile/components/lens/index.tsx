"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

import { lensImages } from "../../data/lens";
import type { LensImage } from "../../types/lens";
import { Panel, PanelHeader, PanelTitle } from "../panel";

// Image grid item component
function ImageGridItem({
  image,
  onClick,
}: {
  image: LensImage;
  onClick: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-lg bg-muted transition-all duration-300",
        {
          "aspect-square": image.aspectRatio === "square" || !image.aspectRatio,
          "aspect-[4/5]": image.aspectRatio === "portrait",
          "aspect-[5/4]": image.aspectRatio === "landscape",
        }
      )}
      onClick={onClick}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className={cn(
          "object-cover transition-all duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Loading skeleton */}
      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-muted" />}

      {/* Overlay with title and description */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
          {image.title && (
            <h3 className="mb-1 text-sm font-semibold">{image.title}</h3>
          )}
          {image.description && (
            <p className="line-clamp-2 text-xs text-white/80">
              {image.description}
            </p>
          )}
          {image.category && (
            <span className="mt-2 inline-block rounded-full bg-white/20 px-2 py-1 text-xs backdrop-blur-sm">
              {image.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Modal component for full-size image viewing
function ImageModal({
  image,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  image: LensImage | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  if (!isOpen || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl">
        <Image
          src={image.src}
          alt={image.alt}
          width={800}
          height={600}
          className="h-auto max-h-[90vh] w-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Navigation buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image info */}
        {(image.title || image.description) && (
          <div className="absolute right-4 bottom-4 left-4 rounded-lg bg-black/50 p-4 text-white backdrop-blur-sm">
            {image.title && (
              <h3 className="mb-1 font-semibold">{image.title}</h3>
            )}
            {image.description && (
              <p className="text-sm text-white/80">{image.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Lens() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [filter, setFilter] = useState<string>("all");

  const categories: string[] = [
    "all",
    ...Array.from(
      new Set(
        lensImages
          .map((img) => img.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    ),
  ];

  const filteredImages =
    filter === "all"
      ? lensImages
      : lensImages.filter((img) => img.category === filter);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0
          ? filteredImages.length - 1
          : selectedImageIndex - 1
      );
    }
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Lens</PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                filter === category
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Images grid */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((image, index) => (
              <ImageGridItem
                key={image.id}
                image={image}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No images found for this category.</p>
          </div>
        )}
      </div>

      {/* Image modal */}
      <ImageModal
        image={
          selectedImageIndex !== null
            ? filteredImages[selectedImageIndex]
            : null
        }
        isOpen={selectedImageIndex !== null}
        onClose={handleCloseModal}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </Panel>
  );
}
