import { MobileNav } from "@/components/mobile-nav";
import { ScrollTop } from "@/components/scroll-top";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/cn";

import { NAV_LINKS } from "./config";
import { SiteHeader } from "./site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />

      <MobileNav
        className="fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-50 -translate-x-1/2 shadow-lg sm:hidden"
        items={NAV_LINKS}
        align="center"
        sideOffset={8}
      />

      <div className="max-w-screen overflow-x-hidden">
        <div className="mx-auto px-4 md:max-w-3xl">
          <div className="mt-2 min-h-[calc(100vh-0.5rem)] border-x border-edge">
            <div className="screen-line-after flex h-12" />

            <div
              className={cn(
                "h-8 px-2",
                "screen-line-after",
                "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
                "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"
              )}
            />

            {children}
          </div>

          <SiteFooter />
        </div>
      </div>

      <ScrollTop className="[--bottom:0.5rem] sm:[--bottom:2rem]" />
    </>
  );
}
