"use client";

import { useEffect, useMemo, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface NoteTocProps {
  content: string;
}

export function NoteToc({ content }: NoteTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  const toc = useMemo(() => {
    // Extract headings from content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();

      headings.push({ id, text, level });
    }
    return headings;
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    // Observe all headings
    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length < 3) return null; // Only show TOC if there are 3+ headings

  return (
    <div className="screen-line-after px-4 py-4">
      <div className="rounded-lg border bg-muted/30 p-4">
        <h2 className="mb-3 font-heading text-sm font-semibold text-muted-foreground">
          Table of Contents
        </h2>
        <nav>
          <ul className="space-y-1 text-sm">
            {toc.map(({ id, text, level }) => (
              <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }}>
                <a
                  href={`#${id}`}
                  className={`block py-1 text-muted-foreground transition-colors hover:text-foreground ${
                    activeId === id ? "font-medium text-foreground" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
