"use client";

import { Bot, Copy, RefreshCw, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useAiSummary } from "@/hooks/use-ai-summary";
import { cn } from "@/lib/cn";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface FloatingAiSummaryProps {
  content: string;
  className?: string;
}

export function FloatingAiSummary({
  content,
  className,
}: FloatingAiSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { generateSummary, isLoading, summary, error, clearSummary } =
    useAiSummary();

  const handleToggle = async () => {
    if (!isOpen && !summary && !isLoading) {
      // Generate summary when opening for the first time
      await generateSummary(content);
    }
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleRefresh = async () => {
    clearSummary();
    await generateSummary(content);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className={cn("fixed bottom-20 left-6 z-50 lg:bottom-6", className)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1,
        }}
      >
        <Button
          onClick={handleToggle}
          size="lg"
          className="group relative h-14 w-14 rounded-full bg-primary shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          disabled={isLoading}
        >
          <Bot className="h-6 w-6 text-primary-foreground transition-transform group-hover:scale-110" />

          {/* Beta Badge */}
          <div className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg">
            BETA
          </div>
        </Button>
      </motion.div>

      {/* Popup Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Panel */}
            <motion.div
              className="fixed bottom-36 left-6 z-50 w-80 max-w-[calc(100vw-3rem)] rounded-xl border bg-background/95 shadow-2xl backdrop-blur-md lg:bottom-24"
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 20,
                x: -20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 20,
                x: -20,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-semibold">
                    AI Portfolio Summary
                  </h3>
                  <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white">
                    BETA
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {summary && (
                    <>
                      <Button
                        onClick={handleCopy}
                        variant="ghost"
                        size="default"
                        className="h-8 w-8 p-0"
                        disabled={!summary}
                      >
                        <Copy
                          className={cn("h-4 w-4", copied && "text-green-600")}
                        />
                      </Button>
                      <Button
                        onClick={handleRefresh}
                        variant="ghost"
                        size="default"
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <RefreshCw
                          className={cn("h-4 w-4", isLoading && "animate-spin")}
                        />
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size={"default"}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-80 overflow-y-auto p-4">
                {isLoading && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bot className="h-4 w-4" />
                      Generating AI summary...
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      <p className="font-medium">Failed to generate summary</p>
                      <p className="mt-1 opacity-80">{error}</p>
                    </div>
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                      size="default"
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                )}

                {summary && (
                  <div className="space-y-3">
                    <div className="prose prose-sm max-w-none">
                      <p className="m-0 text-sm leading-relaxed text-foreground">
                        {summary}
                      </p>
                    </div>

                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-xs text-green-600"
                      >
                        <Copy className="h-3 w-3" />
                        Copied to clipboard!
                      </motion.div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      💡 This is a beta feature. AI-generated summary provides a
                      quick overview of the portfolio.
                    </div>
                  </div>
                )}

                {!summary && !isLoading && !error && (
                  <div className="py-4 text-center">
                    <Bot className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                    <p className="mb-3 text-sm text-muted-foreground">
                      Get an AI-powered summary of this portfolio
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground/70">
                      🧪 Beta feature powered by Google Gemini
                    </p>
                    <Button
                      onClick={() => generateSummary(content)}
                      variant="outline"
                      size="default"
                      className="w-full"
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Summary
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
