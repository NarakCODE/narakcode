"use client";

import { Bot, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

import { useAiSummary } from "@/hooks/use-ai-summary";
import { cn } from "@/lib/cn";

import { Button } from "./ui/button";

interface AiSummaryPanelProps {
  content: string;
  title?: string;
  className?: string;
}

export function AiSummaryPanel({
  content,
  title = "AI Summary",
  className,
}: AiSummaryPanelProps) {
  const [copied, setCopied] = useState(false);
  const { generateSummary, isLoading, summary, error } = useAiSummary();

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
        </div>

        {summary && (
          <div className="flex gap-1">
            <Button
              onClick={handleCopy}
              variant="ghost"
              className="h-7 w-7 p-0"
            >
              <Copy className={cn("h-3 w-3", copied && "text-green-500")} />
            </Button>
            <Button
              onClick={() => generateSummary(content)}
              variant="ghost"
              className="h-7 w-7 p-0"
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("h-3 w-3", isLoading && "animate-spin")}
              />
            </Button>
          </div>
        )}
      </div>

      {!summary && !isLoading && !error && (
        <div className="py-4 text-center">
          <Button onClick={() => generateSummary(content)} variant="outline">
            Generate Summary
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          <div className="h-3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      )}

      {error && (
        <div className="py-2 text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            Failed to generate
          </p>
          <Button onClick={() => generateSummary(content)} variant="outline">
            Retry
          </Button>
        </div>
      )}

      {summary && (
        <div className="text-sm leading-relaxed text-muted-foreground">
          {summary}
          {copied && <p className="mt-2 text-xs text-green-500">Copied</p>}
        </div>
      )}
    </div>
  );
}
