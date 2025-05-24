"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { BrandContextMenu } from "@/components/brand-context-menu";
// import { NarakCODEMark } from "@/components/chanhdai-mark";
import { NarakCodeMark } from "@/components/narakcode-mark";
import { NavItemGitHub } from "@/components/nav-item-github";
import { NavScrollspy } from "@/components/nav-scrollspy";
import { ToggleTheme } from "@/components/toggle-theme";

import { NAV_LINKS } from "../config/nav";

export function SiteHeader() {
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= 200);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background pt-2">
      <div className="mx-auto px-4 md:max-w-3xl">
        <div className="screen-line-before screen-line-after flex h-12 items-center gap-4 border-x border-edge px-2">
          <motion.div
            initial={{ opacity: 0, visibility: "hidden" }}
            animate={{
              opacity: visible ? 1 : 0,
              visibility: visible ? "visible" : "hidden",
            }}
          >
            <BrandContextMenu>
              <Link href="/" aria-label="Home">
                {/* <NarakCODEMark className="h-8" /> */}
                <NarakCodeMark className="h-8" />
              </Link>
            </BrandContextMenu>
          </motion.div>

          <div className="flex-1" />

          <NavScrollspy className="max-md:hidden" items={NAV_LINKS} />

          <div className="flex items-center gap-2">
            <NavItemGitHub />
            <ToggleTheme />
          </div>
        </div>
      </div>
    </header>
  );
}
