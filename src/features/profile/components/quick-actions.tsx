"use client";

import { Send, UserPlus, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useState } from "react";

import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles } from "@/components/ui/sparkles";
import { CardsViewIcon } from "@/components/unlumen-ui/cards-view-icon";
import { USER } from "@/data/user";
import { useIsClient } from "@/hooks/use-is-client";
import { decodeEmail } from "@/utils/string";

import { NAV_LINKS } from "../config/nav";

const CONNECTORS = [
  {
    name: "Telegram",
    icon: <TelegramIcon className="size-6" />,
    href: "https://t.me/LuChannarak",
  },
  {
    name: "GitHub",
    icon: <GithubIcon className="size-6 text-white" />,
    href: "https://github.com/NarakCODE",
  },
  {
    name: "Gmail",
    icon: <GmailIcon className="size-6" />,
    href: "mailto:channarakluy@gmail.com",
  },
  {
    name: "Save vCard",
    icon: (
      <Image
        src="/images/vcard.png"
        width={24}
        height={24}
        className="size-6 rounded-md object-contain"
        alt="vCard"
      />
    ),
    href: "/vcard",
  },
];

export function QuickActions() {
  const isClient = useIsClient();

  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    const direction = latestValue - (scrollY.getPrevious() ?? 0);
    setHidden(direction > 0);
  });

  return (
    <>
      <div className="h-14" />

      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-background pb-[calc(0.5rem+env(safe-area-inset-bottom,0))]"
        initial={{ opacity: 1 }}
        animate={{
          opacity: hidden ? 0.5 : 1,
        }}
        whileHover={{
          opacity: 1,
        }}
      >
        <div className="screen-line-before before:z-1">
          <div className="mx-auto px-4 md:max-w-3xl">
            <div className="border-x border-edge pt-2">
              <div className="screen-line-before screen-line-after -mx-px flex h-12 items-center justify-end gap-3 px-2 md:gap-4 md:px-4">
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      className="group h-10 w-10 cursor-pointer rounded-full bg-linear-to-b from-zinc-700 to-zinc-800 text-white shadow-md inset-shadow-2xs inset-shadow-white/20 transition-all duration-300 hover:scale-105 active:scale-95 dark:from-zinc-600 dark:to-zinc-700"
                    >
                      <CardsViewIcon
                        isActive={isDropdownOpen}
                        className="size-5"
                      />
                      <span className="sr-only">Quick Actions</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" sideOffset={8}>
                    <DropdownMenuItem asChild>
                      <a
                        href={
                          isClient ? `mailto:${decodeEmail(USER.email)}` : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full cursor-pointer items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send Email</span>
                      </a>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={() => setIsDrawerOpen(true)}
                      className="flex w-full cursor-pointer items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Connect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <MobileNav
                  className="md:hidden"
                  items={NAV_LINKS}
                  sideOffset={7}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="mx-auto w-full border-none bg-transparent p-0 shadow-none">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Connect</DrawerTitle>
            <DrawerDescription>
              Bring your tools and apps into one connected workspace.
            </DrawerDescription>
          </DrawerHeader>

          <div className="relative w-full overflow-hidden rounded-t-4xl border-t border-white/10 bg-zinc-950 px-4 pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom,0))] text-white shadow-2xl sm:px-5 md:px-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/4 to-transparent" />

            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close drawer"
                className="absolute top-5 left-5 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </DrawerClose>

            <div className="relative z-10 mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl">
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/25" />

              <div className="flex flex-col pt-16">
                <div className="text-left">
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Connect with me
                  </h3>
                  <p className="mt-2 mb-6 max-w-85 text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                    Reach out directly via Telegram, email me on Gmail, save my
                    contact vCard, or check out my repositories on GitHub.
                  </p>
                </div>

                <div className="relative z-10 overflow-hidden rounded-2xl bg-white/8 p-1.5 backdrop-blur-xl sm:rounded-3xl sm:p-2">
                  {CONNECTORS.map((connector) => (
                    <div
                      key={connector.name}
                      className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 sm:gap-4 sm:rounded-2xl sm:px-3 sm:py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:size-12 sm:rounded-2xl">
                          {connector.icon}
                        </div>

                        <span className="truncate text-sm font-medium text-white/90 sm:text-base">
                          {connector.name}
                        </span>
                      </div>

                      <Button
                        className="h-9 shrink-0 cursor-pointer rounded-full bg-white/10 px-4 text-xs font-semibold text-white shadow-none hover:bg-white/15 sm:h-10 sm:px-5 sm:text-sm"
                        asChild
                      >
                        <a
                          href={connector.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Connect
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sparkles background effect */}
            <div className="pointer-events-none absolute inset-0 -bottom-44 z-0 overflow-hidden mask-[radial-gradient(100%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#3273ff,transparent_90%)] before:opacity-40">
              <Sparkles
                density={1800}
                speed={1.2}
                color="#48b6ff"
                className="absolute inset-x-0 h-full w-full"
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function TelegramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <defs>
        <linearGradient
          id="telegram-gradient"
          x1="50%"
          x2="50%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#2AABEE" />
          <stop offset="100%" stopColor="#229ED9" />
        </linearGradient>
      </defs>
      <path
        fill="url(#telegram-gradient)"
        d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51 0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0Z"
      />
      <path
        fill="#FFF"
        d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z"
      />
    </svg>
  );
}

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
        transform="scale(64)"
        fill="currentColor"
      />
    </svg>
  );
}

function GmailIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <g fill="none">
        <rect width="256" height="256" fill="#f4f2ed" rx="60" />
        <path
          fill="#4285f4"
          d="M41.636 203.039h31.818v-77.273L28 91.676v97.727c0 7.545 6.114 13.636 13.636 13.636"
        />
        <path
          fill="#34a853"
          d="M182.545 203.039h31.819c7.545 0 13.636-6.114 13.636-13.636V91.675l-45.455 34.091"
        />
        <path
          fill="#fbbc04"
          d="M182.545 66.675v59.09L228 91.676V73.492c0-16.863-19.25-26.477-32.727-16.363"
        />
        <path
          fill="#ea4335"
          d="M73.455 125.766v-59.09L128 107.583l54.545-40.909v59.091L128 166.675"
        />
        <path
          fill="#c5221f"
          d="M28 73.493v18.182l45.454 34.091v-59.09L60.727 57.13C47.227 47.016 28 56.63 28 73.493"
        />
      </g>
    </svg>
  );
}
