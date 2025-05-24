import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";

import { type NavItemType, NavLink } from "./nav";

export function MobileNav({
  items,
  align = "end",
  sideOffset,
  className,
}: {
  items: NavItemType[];
  align?: "center" | "end" | "start";
  sideOffset?: number;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("group/toggle flex flex-col gap-1", className)}
          size="icon:lg"
        >
          <span className="flex h-0.5 w-4 transform rounded-[1px] bg-white transition-transform group-data-[state=open]/toggle:translate-y-[3px] group-data-[state=open]/toggle:rotate-45" />
          <span className="flex h-0.5 w-4 transform rounded-[1px] bg-white transition-transform group-data-[state=open]/toggle:translate-y-[-3px] group-data-[state=open]/toggle:-rotate-45" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-xs"
        sideOffset={sideOffset}
        align={align}
      >
        {items.map((link) => (
          <DropdownMenuItem
            key={link.href}
            className="font-mono text-base"
            asChild
          >
            <NavLink href={link.href}>{link.title}</NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
