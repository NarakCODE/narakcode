import Link from "next/link";
import React from "react";

import { cn } from "@/lib/cn";

export type NavItemType = {
  href: string;
  title: string;
};

export function Nav({
  items,
  className,
  activeId,
}: {
  items: NavItemType[];
  className?: string;
  activeId?: string | null;
}) {
  return (
    <nav className={cn("flex items-center gap-3", className)}>
      {items.map(({ title, href }) => {
        const active =
          activeId === href || (href !== "/" && activeId?.startsWith(href));

        return (
          <NavItem key={href} href={href} active={active}>
            {title}
          </NavItem>
        );
      })}
    </nav>
  );
}

export function NavItem({
  active,
  ...props
}: React.ComponentProps<typeof NavLink> & {
  active?: boolean;
}) {
  return (
    <NavLink
      className={cn(
        "font-mono text-sm font-medium text-muted-foreground transition-all duration-300",
        active && "text-foreground"
      )}
      {...props}
    />
  );
}

export function NavLink({
  href,
  ...props
}: React.ComponentProps<"a"> & {
  href: string;
}) {
  const shouldUseNextLink = href.startsWith("/");

  if (shouldUseNextLink) {
    return <Link href={href} {...props} />;
  }

  return <a href={href} {...props} />;
}
