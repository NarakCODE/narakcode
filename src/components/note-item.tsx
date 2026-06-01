import { Calendar, ChevronRight, Clock, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { cn, formatDate, getReadingTime } from "@/lib/utils";
import type { Note } from "@/types/notes";

function isVideoUrl(url: string): boolean {
  const videoExtensions = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
  const videoPlatforms = /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com/i;
  return videoExtensions.test(url) || videoPlatforms.test(url);
}

function getVideoThumbnail(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

export default function NoteItem({ note }: { note: Note }) {
  const readingTime = getReadingTime(note.content);
  const isUpdated = note.metadata.updatedAt !== note.metadata.createdAt;
  const hasMedia = note.metadata.image;
  const isVideo = hasMedia && isVideoUrl(note.metadata.image!);
  const videoThumbnail = isVideo
    ? getVideoThumbnail(note.metadata.image!)
    : null;

  return (
    <Link
      href={`/notes/${note.slug}`}
      className={cn(
        "group/note block transition-colors duration-200 hover:bg-muted/40",
        "screen-line-before screen-line-after"
      )}
    >
      <article className="flex w-full flex-col gap-3 p-4">
        {/* Media preview section */}
        {hasMedia && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/20">
            {isVideo ? (
              <>
                {videoThumbnail ? (
                  <>
                    <Image
                      src={videoThumbnail}
                      alt={note.metadata.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover/note:bg-black/30">
                      <div className="flex size-14 items-center justify-center rounded-full bg-background/90 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover/note:scale-110">
                        <Play className="ml-1 size-6 fill-foreground text-foreground" />
                      </div>
                    </div>
                  </>
                ) : (
                  <video
                    src={note.metadata.image!}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="size-full object-cover"
                  />
                )}
              </>
            ) : (
              <Image
                src={note.metadata.image!}
                alt={note.metadata.title}
                fill
                className="object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
          </div>
        )}

        {/* Content section */}
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2.5">
            {/* Header with title and featured indicator */}
            <div className="flex items-start gap-2.5">
              <h3 className="flex-1 font-heading text-lg leading-snug font-medium text-balance text-foreground transition-colors">
                {note.metadata.title}
              </h3>
              {note.metadata.featured && (
                <Star className="mt-0.5 size-4 flex-shrink-0 fill-amber-500 text-amber-500 transition-transform duration-200 group-hover/note:scale-105" />
              )}
            </div>

            {/* Description */}
            {note.metadata.description && (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
                {note.metadata.description}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground/80">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/70" />
                <time dateTime={note.metadata.createdAt} className="font-mono">
                  {formatDate(note.metadata.createdAt)}
                </time>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground/70" />
                <span className="font-mono">{readingTime}</span>
              </div>

              {isUpdated && (
                <span className="inline-flex items-center rounded-full border border-edge bg-muted px-2 py-0.25 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  Updated
                </span>
              )}
            </div>

            {/* Tags */}
            {note.metadata.tags && note.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {note.metadata.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
                {note.metadata.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="h-auto rounded-md border-edge/60 bg-muted/30 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-none"
                  >
                    +{note.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Arrow icon */}
          <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover/note:translate-x-0.5 group-hover/note:text-foreground" />
        </div>
      </article>
    </Link>
  );
}
