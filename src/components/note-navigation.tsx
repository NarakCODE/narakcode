import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Note } from "@/types/notes";

interface NoteNavigationProps {
  previous: Note | null;
  next: Note | null;
}

export function NoteNavigation({ previous, next }: NoteNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav className="screen-line-before flex items-center justify-between gap-4 px-4 py-6">
      <div className="flex-1">
        {previous && (
          <Button variant="outline" asChild>
            <Link href={`/notes/${previous.slug}`}>
              <ChevronLeftIcon className="size-4" />
              {previous.metadata.title}
            </Link>
          </Button>
        )}
      </div>

      <div className="flex-1 text-right">
        {next && (
          <Button variant="outline" asChild>
            <Link href={`/notes/${next.slug}`}>
              {next.metadata.title}
              <ChevronRightIcon className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
