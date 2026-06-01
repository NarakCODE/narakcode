import dayjs from "dayjs";
import { CalendarIcon, ChevronLeftIcon, ClockIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { JsonLd } from "@/components/json-ld";
import { MDX } from "@/components/mdx";
import { NoteNavigation } from "@/components/note-navigation";
import { NoteShare } from "@/components/note-share";
import { NoteTags } from "@/components/note-tags";
// import { NoteToc } from "@/components/note-toc";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/typography";
import { SITE_INFO } from "@/config/site";
import { getAdjacentNotes, getAllNotes } from "@/data/notes";
import { USER } from "@/data/user";
import { formatDate, getReadingTime } from "@/lib/utils";
import type { Note } from "@/types/notes";

export async function generateStaticParams() {
  const notes = getAllNotes();

  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const note = getAllNotes().find((note) => note.slug === slug);

  if (!note) {
    return {};
  }

  const { title, description, image, createdAt, updatedAt } = note.metadata;

  const ogImage = image || `/og/simple?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/notes/${note.slug}`,
    },
    openGraph: {
      url: `/notes/${note.slug}`,
      type: "article",
      publishedTime: dayjs(createdAt).toISOString(),
      modifiedTime: dayjs(updatedAt).toISOString(),
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

function getPageJsonLd(note: Note): WithContext<PageSchema> {
  const baseData: WithContext<PageSchema> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.metadata.title,
    description: note.metadata.description,
    image:
      note.metadata.image ||
      `/og/simple?title=${encodeURIComponent(note.metadata.title)}`,
    url: `${SITE_INFO.url}/notes/${note.slug}`,
    datePublished: dayjs(note.metadata.createdAt).toISOString(),
    dateModified: dayjs(note.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: SITE_INFO.url + USER.avatar,
    },
    publisher: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: SITE_INFO.url + USER.avatar,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_INFO.url}/notes/${note.slug}`,
    },
  };

  // Add keywords if tags exist
  if (note.metadata.tags && note.metadata.tags.length > 0) {
    return {
      ...baseData,
      keywords: note.metadata.tags.join(", "),
    } as WithContext<PageSchema>;
  }

  return baseData;
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const slug = (await params).slug;
  const note = getAllNotes().find((note) => note.slug === slug);

  if (!note) {
    notFound();
  }

  const websiteJsonLd = getPageJsonLd(note);
  const { previous, next } = getAdjacentNotes(slug);
  const readingTime = getReadingTime(note.content);
  const isUpdated = note.metadata.updatedAt !== note.metadata.createdAt;

  return (
    <>
      <JsonLd id="note-jsonld" data={websiteJsonLd} />

      {/* Back navigation */}
      <div className="screen-line-after flex pb-4">
        <Button variant="link" className="px-2 text-base" asChild>
          <Link href="/notes">
            <ChevronLeftIcon className="size-5" />
            Notes
          </Link>
        </Button>
      </div>

      <Prose className="px-4">
        <div className="screen-line-after">
          <h1 className="mb-6 font-heading font-semibold">
            {note.metadata.title}
          </h1>
        </div>
        {/* Metadata section */}
        <div className="screen-line-after space-y-3 pb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              <time dateTime={dayjs(note.metadata.createdAt).toISOString()}>
                {formatDate(note.metadata.createdAt)}
              </time>
            </div>

            <div className="flex items-center gap-1">
              <ClockIcon className="size-4" />
              <span>{readingTime}</span>
            </div>

            {isUpdated && (
              <div className="text-sm">
                {/* Updated {formatDate(note.metadata.updatedAt)} */}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Tags */}
            {note.metadata.tags && <NoteTags tags={note.metadata.tags} />}
            {/* Share */}
            <NoteShare title={note.metadata.title} slug={note.slug} />
          </div>
        </div>

        <div className="relative pt-4"></div>

        <div>
          <MDX code={note.content} />
        </div>
      </Prose>

      {/* Navigation to adjacent notes */}
      <NoteNavigation previous={previous} next={next} />

      <div className="screen-line-before h-4 w-full" />
    </>
  );
}
