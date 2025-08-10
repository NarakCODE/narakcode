"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { BrandContextMenu } from "@/components/brand-context-menu";
// import { NarakCODEMark } from "@/components/chanhdai-mark";
import { NarakCodeMark } from "@/components/narakcode-mark";
import { NavItemGitHub } from "@/components/nav-item-github";
import { ToggleTheme } from "@/components/toggle-theme";

import { DesktopNav } from "./desktop-nav";

export function SiteHeader() {
  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setShowBackground(latestValue > 0);
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-2 duration-300 ${showBackground ? "bg-background/70 backdrop-blur-lg backdrop-saturate-150" : ""}`}
    >
      <div className="mx-auto px-4 md:max-w-3xl">
        <div
          className={`flex h-12 items-center gap-4 px-2 ${showBackground && "screen-line-before screen-line-after border-x border-edge"}`}
        >
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
