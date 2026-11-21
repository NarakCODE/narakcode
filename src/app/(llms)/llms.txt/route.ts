import { SITE_INFO } from "@/config/site"
import { markdownResponse } from "@/lib/markdown-response"
import { getBlogPosts, getComponentDocs } from "@/features/doc/data/documents"

const allComponents = getComponentDocs()
const allPosts = getBlogPosts()

const content = `# narakcode.dev

> A dev portfolio showcasing my work as a Software Developer.

- [About](${SITE_INFO.url}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${SITE_INFO.url}/experience.md): Highlights from my career and key roles I've taken on.
- [Education](${SITE_INFO.url}/education.md): Where I studied, what I focused on, and what I built along the way.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects that show my skills and creativity.
- [Components](${SITE_INFO.url}/components.md): Every registry component, with install instructions.
- [Blocks](${SITE_INFO.url}/blocks.md): Every registry block, grouped by category, with install instructions.
- [Blog](${SITE_INFO.url}/blog.md): Every blog post, newest first, with publish dates.

## Components

${allComponents.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/components/${item.slug}.md): ${item.metadata.description}`).join("\n")}

## Blog

${allPosts.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/blog/${item.slug}.md): ${item.metadata.description}`).join("\n")}
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return markdownResponse(content, { negotiated: true })
}
