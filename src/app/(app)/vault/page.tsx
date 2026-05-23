import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { VaultDashboard } from "./vault-client";

export const metadata: Metadata = {
  title: "Vault",
  description:
    "A curated chest of custom developer tools, premium code shaders, layout helpers, and high-fidelity design resources.",
  alternates: {
    canonical: "/vault",
  },
  openGraph: {
    url: "/vault",
    type: "website",
  },
};

export default function VaultPage() {
  return (
    <>
      <div className="screen-line-after flex pb-4">
        <Button variant="link" className="px-2 text-base" asChild>
          <Link href="/">
            <ChevronLeftIcon className="size-5" />
            Home
          </Link>
        </Button>
      </div>

      <div className="screen-line-after space-y-2 px-4 pb-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Vault
        </h1>
      </div>

      <VaultDashboard />

      <div className="h-4" />
    </>
  );
}
