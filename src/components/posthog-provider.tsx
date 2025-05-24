"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import React, { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const POSTHOG_UI_HOST = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST;

const shouldLoad = !!(POSTHOG_KEY && POSTHOG_HOST);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (shouldLoad) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        ui_host: POSTHOG_UI_HOST || "https://us.posthog.com",
        person_profiles: "identified_only",
      });
    }
  }, []);

  if (!shouldLoad) {
    return <>{children}</>;
  }

  return <Provider client={posthog}>{children}</Provider>;
}
