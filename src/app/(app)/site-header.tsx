import Link from "next/link";

import { BrandContextMenu } from "@/components/brand-context-menu";
// import { NarakCODEMark } from "@/components/chanhdai-mark";
import { NarakCodeMark } from "@/components/narakcode-mark";
import { NavItemGitHub } from "@/components/nav-item-github";
import { ToggleTheme } from "@/components/toggle-theme";

import { DesktopNav } from "./desktop-nav";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background pt-2">
      <div className="mx-auto px-4 md:max-w-3xl">
        <div className="screen-line-before screen-line-after flex h-12 items-center justify-between gap-4 border-x border-edge px-2">
          <BrandContextMenu>
            <Link href="/" aria-label="Home">
              {/* <NarakCODEMark className="h-8" /> */}
              <NarakCodeMark className="h-8" />
            </Link>
          </BrandContextMenu>

          <div className="flex-1" />

          <DesktopNav />

          <div className="flex items-center gap-2">
            <NavItemGitHub />
            <ToggleTheme />
          </div>
        </div>
      </div>
    </header>
  );
}
