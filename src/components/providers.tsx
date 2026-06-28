"use client";

import { AppProgressProvider } from "@bprogress/next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider as JotaiProvider } from "jotai";
import { useServerInsertedHTML } from "next/navigation";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { META_THEME_COLORS } from "@/config/site";

import { PostHogProvider } from "./posthog-provider";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    )
      return;
    orig.apply(console, args);
  };
}

export function Providers({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce?: string;
}) {
  useServerInsertedHTML(() => {
    return (
      <script
        nonce={nonce}
        id="theme-color-init"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage['narakcode.theme'] === 'dark' || ((!('narakcode.theme' in localStorage) || localStorage['narakcode.theme'] === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
              }
            } catch (_) {}
          `,
        }}
      />
    );
  });
  return (
    <JotaiProvider>
      <ThemeProvider
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        storageKey="narakcode.theme"
        defaultTheme="system"
        attribute="class"
      >
        <AppProgressProvider
          color="#2563eb"
          height="2px"
          delay={500}
          options={{ showSpinner: false }}
        >
          <PostHogProvider>{children}</PostHogProvider>
        </AppProgressProvider>

        <Toaster />
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </JotaiProvider>
  );
}
