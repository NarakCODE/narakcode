import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date format (January 1, 2025)
// createdAt: "2025-01-01"
export function formatDate(date: string) {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString("default", { month: "long" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day}, ${year}`;
}

// Average reading speed: ~200 words per minute
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content
    .replace(/[#_*>\-\[\]`]/g, "") // strip Markdown symbols
    .trim()
    .split(/\s+/).length;

  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes < 1) return "Less than a minute read";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} read`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min${remainingMinutes > 1 ? "s" : ""} read`
    : `${hours} hour${hours > 1 ? "s" : ""} read`;
}
