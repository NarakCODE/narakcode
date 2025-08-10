import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import NoteItem from "@/components/note-item";
import { Button } from "@/components/ui/button";
import { getAllNotes } from "@/data/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Personal notes and thoughts",
  alternates: {
    canonical: "/notes",
  },
  openGraph: {
    url: "/notes",
    type: "website",
  },
};

export default function NotesPage() {
  const notes = getAllNotes().sort(
    (a, b) =>
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
  );

  return (
    <>
      <div className="screen-line-after flex pb-4">
        <Button variant="link" className="px-2 text-base" asChild>
          <Link href="/">
            <ChevronLeftIcon className="size-5" />
            Home
          </Link>
        </Button>
      </div>

      <div className="screen-line-after space-y-3 px-4">
        <h1 className="font-heading text-3xl font-semibold">Notes</h1>
      </div>

      <div className="relative pt-4">
        <div className="space-y-0">
          {notes.map((note) => (
            <NoteItem key={note.slug} note={note} />
          ))}
        </div>
      </div>

      <div className="h-4" />
    </>
  );
}
