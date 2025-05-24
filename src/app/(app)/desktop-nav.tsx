"use client";

import { usePathname } from "next/navigation";

import { Nav } from "@/components/nav";

import { NAV_LINKS } from "./config";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <Nav className="max-sm:hidden" items={NAV_LINKS} activeId={pathname} />
  );
}
