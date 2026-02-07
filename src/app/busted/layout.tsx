import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nice Try! 🕵️",
  description: "You thought you could hack me? Think again!",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "🚨 Caught in 4K 🚨",
    description: "Someone tried to hack my portfolio and got caught!",
    type: "website",
  },
};

export default function BustedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
