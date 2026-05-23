import { Calendar, ChevronRight, Clock, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { cn, formatDate, getReadingTime } from "@/lib/utils";
import type { Note } from "@/types/notes";

export default function NoteItem({ note }: { note: Note }) {
  const readingTime = getReadingTime(note.content);
  const isUpdated = note.metadata.updatedAt !== note.metadata.createdAt;

  return (
    <Link
      href={`/notes/${note.slug}`}
      className={cn(
        "group/note block transition-colors duration-200 hover:bg-muted/40",
        "screen-line-before screen-line-after"
      )}
    >
      <article className="flex w-full items-start justify-between gap-4 p-4">
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
                <Badge
                  key={tag}
                  variant="outline"
                  className="h-auto rounded-md border-primary/10 bg-primary/5 px-2 py-0.5 font-mono text-[10px] font-medium text-primary capitalize shadow-none transition-colors duration-200 hover:bg-primary/10"
                >
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
      </article>
    </Link>
  );
}
