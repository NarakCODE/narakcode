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
        "group/note block transition-all duration-200 hover:bg-muted/30",
        "screen-line-before screen-line-after"
      )}
    >
      <article className="flex w-full items-start justify-between gap-4 p-4">
        <div className="flex-1 space-y-2">
          {/* Header with title and featured indicator */}
          <div className="flex items-start gap-2">
            <h3 className="flex-1 font-heading text-lg leading-tight font-medium text-balance transition-colors">
              {note.metadata.title}
            </h3>
            {note.metadata.featured && (
              <Star className="mt-0.5 size-4 flex-shrink-0 fill-amber-500 text-amber-500" />
            )}
          </div>

          {/* Description */}
          {note.metadata.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {note.metadata.description}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <time dateTime={note.metadata.createdAt}>
                {formatDate(note.metadata.createdAt)}
              </time>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{readingTime}</span>
            </div>

            {isUpdated && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                Updated
              </span>
            )}
          </div>

          {/* Tags */}
          {note.metadata.tags && note.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.metadata.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="h-auto px-2 py-0.5 text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {note.metadata.tags.length > 3 && (
                <Badge variant="outline" className="h-auto px-2 py-0.5 text-xs">
                  +{note.metadata.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Arrow icon */}
        <ChevronRight className="mt-1 size-5 flex-shrink-0 text-muted-foreground transition-all group-hover/note:translate-x-0.5 group-hover/note:text-foreground" />
      </article>
    </Link>
  );
}
