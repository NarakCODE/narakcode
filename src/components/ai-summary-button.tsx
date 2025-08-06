"use client";

import { Bot, X } from "lucide-react";
import { useState } from "react";

import { useAiSummary } from "@/hooks/use-ai-summary";
import { cn } from "@/lib/cn";

import { Button } from "./ui/button";

interface AiSummaryButtonProps {
  content: string;
  className?: string;
}

export function AiSummaryButton({ content, className }: AiSummaryButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { generateSummary, isLoading, summary, error, clearSummary } =
    useAiSummary();

  const handleSummarize = async () => {
    if (summary) {
      // If summary exists, toggle the expanded state
      setIsExpanded(!isExpanded);
      return;
    }

    // Generate new summary
    await generateSummary(content);
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    clearSummary();
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={handleSummarize}
        disabled={isLoading}
        variant="outline"
        className="group relative border-dashed transition-all hover:border-solid"
      >
        <Bot className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
        {isLoading ? "Generating..." : "AI Summary"}
      </Button>

      {isExpanded && (summary || error) && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {error ? (
                <div className="text-sm text-destructive">
                  <p className="font-medium">Error generating summary</p>
                  <p className="mt-1 opacity-80">{error}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">AI Summary</span>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    {summary}
                  </p>
                </div>
              )}
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
