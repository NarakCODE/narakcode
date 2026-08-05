import type { Metadata, Route } from "next"
import Link from "next/link"
import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { BlogPosting as PageSchema, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Prose } from "@/components/ui/typography"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { MDX } from "@/components/mdx"
import { TOCInline } from "@/components/toc-inline"
import { TOCMinimap } from "@/components/toc-minimap"
import { DocKeyboardShortcuts } from "@/features/doc/components/doc-keyboard-shortcuts"
import { DocLanguageSwitcher } from "@/features/doc/components/doc-language-switcher"
import {
  DocContainer,
  DocContentCol,
  DocGrid,
  DocLeftCol,
  DocRightCol,
} from "@/features/doc/components/doc-layout"
import { LLMCopyButtonWithViewOptions } from "@/features/doc/components/doc-page-actions"
import { DocPageRoot } from "@/features/doc/components/doc-page-root"
import { DocShareMenu } from "@/features/doc/components/doc-share-menu"
import {
  findNeighbour,
  getBlogPostLanguages,
  getBlogPosts,
  getBlogPostUrl,
} from "@/features/doc/data/documents"
import type { BlogLanguage, Doc } from "@/features/doc/types/document"

export function getBlogPostMetadata(doc: Doc, postUrl: string): Metadata {
  const { title, description, image, createdAt, updatedAt } = doc.metadata
  const ogImage =
    image ||
    `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      creator: X_HANDLE,
      images: [ogImage],
    },
  }
}

function getPageJsonLd(doc: Doc, postUrl: string): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(postUrl),
    headline: doc.metadata.title,
    description: doc.metadata.description,
    image:
      doc.metadata.image ||
      absoluteUrl(
        `/og/simple?title=${encodeURIComponent(doc.metadata.title)}&description=${encodeURIComponent(doc.metadata.description)}`
      ),
    url: absoluteUrl(postUrl),
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    author: { "@id": JSON_LD_ID.person },
    mainEntityOfPage: absoluteUrl(postUrl),
    isPartOf: {
      "@type": "Blog",
      "@id": absoluteUrl("/blog"),
      name: "Blog",
      url: absoluteUrl("/blog"),
    },
  }
}

function getMarkdownUrl(slug: string, language: BlogLanguage) {
  return `/blog/${slug}/${language}.mdx`
}

export function BlogPostPage({
  doc,
  language,
  postUrl,
}: {
  doc: Doc
  language: BlogLanguage
  postUrl: string
}) {
  const toc = getTableOfContents(doc.content)
  const allDocs = getBlogPosts(language)
  const { previous, next } = findNeighbour(allDocs, doc.slug)
  const alternateLanguage = getBlogPostLanguages(doc.slug).find(
    (value) => value !== language
  )

  return (
    <>
      <JsonLdScript data={getPageJsonLd(doc, postUrl)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Blog",
            href: "/blog",
          },
          {
            name: doc.metadata.title,
            href: postUrl,
          },
        ])}
      />

      <DocKeyboardShortcuts
        previous={
          previous ? (getBlogPostUrl(previous.slug, language) as Route) : null
        }
        next={next ? (getBlogPostUrl(next.slug, language) as Route) : null}
      />

      <DocPageRoot>
        <DocContainer>
          <div className="screen-line-bottom h-px" />

          <div className="flex items-center justify-between p-2 pl-4">
            <Button
              className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
              variant="link"
              size="sm"
              asChild
            >
              <Link href="/blog">
                <ArrowLeftIcon />
                Blog
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              {alternateLanguage && (
                <DocLanguageSwitcher
                  href={getBlogPostUrl(doc.slug, alternateLanguage) as Route}
                  label={alternateLanguage === "km" ? "ខ្មែរ" : "English"}
                  ariaLabel={
                    alternateLanguage === "km"
                      ? "Read this post in Khmer"
                      : "Read this post in English"
                  }
                />
              )}

              <LLMCopyButtonWithViewOptions
                markdownUrl={getMarkdownUrl(doc.slug, language)}
              />

              <DocShareMenu title={doc.metadata.title} url={postUrl} />

              {previous && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        className="size-7 border-none"
                        variant="secondary"
                        size="icon-sm"
                        asChild
                      >
                        <Link
                          href={
                            getBlogPostUrl(previous.slug, language) as Route
                          }
                          aria-label="Previous post"
                        >
                          <ArrowLeftIcon />
                        </Link>
                      </Button>
                    }
                  />
                  <TooltipContent className="pr-2 pl-3">
                    <div className="flex items-center gap-3">
                      Previous post
                      <Kbd>
                        <ArrowLeftIcon />
                      </Kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}

              {next && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        className="size-7 border-none"
                        variant="secondary"
                        size="icon-sm"
                        asChild
                      >
                        <Link
                          href={getBlogPostUrl(next.slug, language) as Route}
                          aria-label="Next post"
                        >
                          <ArrowRightIcon />
                        </Link>
                      </Button>
                    }
                  />
                  <TooltipContent className="pr-2 pl-3">
                    <div className="flex items-center gap-3">
                      Next post
                      <Kbd>
                        <ArrowRightIcon />
                      </Kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="screen-line-top screen-line-bottom py-px">
            <div className="h-4" />
          </div>

          <h1
            data-slot="doc-title"
            className="screen-line-bottom px-4 text-4xl font-medium tracking-tight text-balance"
          >
            {doc.metadata.title}
          </h1>
        </DocContainer>

        <DocGrid>
          <DocLeftCol />

          <DocContentCol>
            <Prose className="px-(--page-padding) pt-8 [--page-padding:--spacing(4)]">
              <p className="text-muted-foreground">
                {doc.metadata.description}
              </p>

              <TOCInline className="lg:hidden" items={toc} />

              <div>
                <MDX code={doc.content} />
              </div>
            </Prose>

            <div className="screen-line-top h-4" />
          </DocContentCol>

          <DocRightCol>
            <div className="sticky top-[calc(var(--doc-cols-top,0)+(--spacing(3))] translate-x-2 opacity-0 in-data-doc-cols-ready:opacity-100">
              <TOCMinimap items={toc} />
            </div>
          </DocRightCol>
        </DocGrid>
      </DocPageRoot>
    </>
  )
}
