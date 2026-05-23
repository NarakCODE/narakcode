import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import type { WebSite, WithContext } from "schema-dts";

import { Providers } from "@/components/providers";
import { META_THEME_COLORS, SITE_INFO } from "@/config/site";
import { USER } from "@/data/user";
import { fontHeading, fontSans } from "@/lib/fonts";

function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_INFO.name,
    url: SITE_INFO.url,
    alternateName: [USER.username],
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: "/",
  },
  title: {
    template: `%s | ${SITE_INFO.name}`,
    default: `${USER.displayName} - ${USER.jobTitle}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: "NarakCODE",
      url: SITE_INFO.url,
    },
  ],
  creator: "NarakCODE",
  openGraph: {
    siteName: SITE_INFO.name,
    url: "/",
    type: "profile",
    firstName: USER.firstName,
    lastName: USER.lastName,
    username: USER.username,
    gender: USER.gender,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@NarakCODE", // Twitter username
    images: [SITE_INFO.ogImage],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Thanks @shadcn-ui */}
        <script
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
        <script type="application/ld+json">
          {JSON.stringify(getWebSiteJsonLd())}
        </script>
      </head>

      <body>
        <div className="absolute -z-1 min-h-screen w-full bg-background">
          {/* Pearl Mist Background with Top Glow - Only in dark mode */}
          <div
            className="absolute inset-0 z-0 hidden dark:block"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), var(--d-background)",
            }}
          />
        </div>
        <Providers>
          {/* Your Content/Components */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
