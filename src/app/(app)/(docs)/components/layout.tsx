import { DocGrid, DocLeftCol } from "@/features/doc/components/doc-layout"
import { DocPageRoot } from "@/features/doc/components/doc-page-root"
import { getDocsByCategory } from "@/features/doc/data/documents"

import { Sidebar } from "./sidebar"

export default function ComponentDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const componentDocs = getDocsByCategory("components")
    .slice()
    .sort((a, b) =>
      a.metadata.title.localeCompare(b.metadata.title, "en", {
        sensitivity: "base",
      })
    )

  return (
    <DocPageRoot>
      <DocGrid>
        <DocLeftCol className="-translate-x-1 pb-3.75">
          <div className="sticky top-[calc(var(--header-height)+(--spacing(12)))] flex h-[calc(100dvh-var(--header-height)-(--spacing(36)))] w-60 flex-col rounded-xl border bg-background max-xl:hidden">
            <div className="no-scrollbar grow overflow-x-clip overflow-y-auto overscroll-contain scroll-fade-effect-y">
              <Sidebar
                items={componentDocs.map((doc) => ({
                  title: doc.metadata.title,
                  href: `/components/${doc.slug}`,
                }))}
              />
            </div>
          </div>
        </DocLeftCol>

        {children}
      </DocGrid>
    </DocPageRoot>
  )
}
