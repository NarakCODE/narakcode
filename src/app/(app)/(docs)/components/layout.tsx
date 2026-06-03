import { ComponentIcon } from "@/components/icons"
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
        <DocLeftCol className="pr-4 pb-3.75">
          <div className="sticky top-[calc(var(--header-height)+(--spacing(12)))] flex h-[calc(100dvh-var(--header-height)-(--spacing(36)))] w-fit max-w-full flex-col rounded-xl border bg-background max-xl:hidden">
            <Sidebar
              items={componentDocs.map((doc) => ({
                title: doc.metadata.title,
                href: `/components/${doc.slug}`,
                icon: <ComponentIcon variant={doc.slug} />,
              }))}
            />
          </div>
        </DocLeftCol>

        {children}
      </DocGrid>
    </DocPageRoot>
  )
}
