import fs from "fs";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import path from "path";

import { MDX } from "@/components/mdx";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Components",
  description: "A collection of reusable components.",
};

export default function Page() {
  const content = fs.readFileSync(
    path.join(process.cwd(), "src/app/(app)/components/content.mdx"),
    "utf-8"
  );

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

      <div className="screen-line-after px-4">
        <h1 className="font-heading text-3xl font-semibold">Components</h1>
      </div>

      <Prose className="px-4">
        <div>
          <MDX code={content} />
        </div>
      </Prose>

      <div className="screen-line-before h-4 w-full" />
    </>
  );
}
