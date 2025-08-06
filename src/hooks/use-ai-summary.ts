"use client";

import { useState } from "react";

interface SummaryResponse {
  summary: string;
  error?: string;
}

export function useAiSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string>("");

  const generateSummary = async (content: string) => {
    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SummaryResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSummary(data.summary);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate summary";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateSummary,
    isLoading,
    summary,
    error,
    clearSummary: () => setSummary(""),
    clearError: () => setError(""),
  };
}
