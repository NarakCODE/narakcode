// app/api/summarize/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const MAX_RETRIES = 3; // Set the maximum number of retries

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Please provide a concise, professional summary of this portfolio/profile information.
      Focus on key highlights including:
      - Professional background and current role
      - Core skills and expertise
      - Notable achievements or projects
      - Career focus and interests
      Keep the summary engaging and suitable for recruiters or potential collaborators.
      Limit to 3-4 sentences maximum.
      Content to summarize:
      ${content}
    `;

    // --- Retry Logic Loop ---
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const result = await model.generateContent(prompt);
        const summary = result.response.text();
        // Success! Return the response and exit the function.
        return NextResponse.json({ summary });
      } catch (error) {
        const isRetryableError =
          error instanceof Error && error.message.includes("503");

        // If it's not a retryable error or we've run out of retries, throw the error.
        if (!isRetryableError || i === MAX_RETRIES - 1) {
          throw error;
        }

        console.log(`Attempt ${i + 1} failed. Retrying...`);
        // Calculate delay with exponential backoff (e.g., 1s, 2s, 4s)
        const delay = 1000 * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    console.error("AI Summary Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate summary",
      },
      { status: 500 }
    );
  }
}
