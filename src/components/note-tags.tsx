import { TagIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

interface NoteTagsProps {
  tags: string[];
}

export function NoteTags({ tags }: NoteTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <TagIcon className="size-4 text-muted-foreground" />
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            <Link
              href={`/notes?tag=${encodeURIComponent(tag)}`}
              className="decoration-secondary"
            >
              {tag}
            </Link>
          </Badge>
        ))}
      </div>
    </div>
  );
}
