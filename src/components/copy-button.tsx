"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { copyText } from "@/utils/copy";

import { Button } from "./ui/button";

export function CopyButton({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
}) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "z-10 size-6 rounded-md bg-zinc-800 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
        className
      )}
      onClick={() => {
        copyText(value);
        setHasCopied(true);
      }}
      {...props}
    >
      {hasCopied ? (
        <CheckIcon className="size-3" />
      ) : (
        <CopyIcon className="size-3" />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
}
