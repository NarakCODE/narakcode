import { RssIcon } from "lucide-react"

import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { SiteFooterBuiltBySpinner } from "@/components/site-footer-built-by-spinner"
import { getSocialLinkByName } from "@/features/portfolio/data/social-links-v2"

export function SiteFooter() {
  const xLink = getSocialLinkByName("x")
  const githubLink = getSocialLinkByName("github")
  const linkedinLink = getSocialLinkByName("linkedin")

  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="screen-line-top mx-auto border-x border-line pt-4 group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <p className="mb-1 px-4 text-center font-mono text-sm text-balance text-muted-foreground [&_span]:mx-0.5 [&_span]:inline-block">
          Inspired by tailwindcss.com<span>/</span>ui.shadcn.com<span>/</span>
          vercel.com<span>/</span>evilcharts.com
        </p>

        <p className="px-4 text-center font-mono text-sm text-balance text-muted-foreground">
          The source code is available on{" "}
          <a
            className="font-medium text-foreground link-underline"
            href={SOURCE_CODE_GITHUB_URL}
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </p>

        <div className="flex items-center justify-center">
          <div className="relative">
            <SiteFooterBuiltBySpinner />
            <a
              className="absolute inset-4"
              href={xLink?.href}
              target="_blank"
              rel="noopener"
              aria-label="Open X Profile"
            />
          </div>
        </div>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex items-center justify-center gap-3 border-x border-line bg-background px-4">
            <a
              className="flex font-mono text-xs font-medium text-muted-foreground transition-[color] hover:text-foreground max-sm:hidden"
              href={`${SITE_INFO.url}/llms.txt`}
              target="_blank"
              rel="noopener"
            >
              llms.txt
            </a>

            <Separator className="max-sm:hidden" />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={xLink?.href}
              target="_blank"
              rel="noopener"
              aria-label="X Profile"
            >
              <Icons.x className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={githubLink?.href}
              target="_blank"
              rel="noopener"
              aria-label="GitHub Profile"
            >
              <Icons.github className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={linkedinLink?.href}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn Profile"
            >
              <Icons.linkedin className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={`${SITE_INFO.url}/rss`}
              target="_blank"
              rel="noopener"
              aria-label="RSS"
            >
              <RssIcon className="size-4" />
            </a>

            <Separator />

            <a
              className="flex text-muted-foreground transition-[color] hover:text-foreground"
              href={
                process.env.NEXT_PUBLIC_DMCA_URL ||
                "https://www.dmca.com/ProtectionPro.aspx"
              }
              target="_blank"
              rel="noopener"
              aria-label="DMCA.com Protection Status"
            >
              <Icons.dmca className="h-4.5 w-auto" />
            </a>
          </div>
        </div>

        {/* <div className="*:absolute *:z-2 *:flex *:size-2 *:border *:border-line *:bg-background">
          <div className="bottom-[-3.5px] left-[-4.5px]" />
          <div className="right-[-4.5px] bottom-[-3.5px]" />
        </div> */}
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-24" />
      </div>
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-line", className)} {...props} />
}
