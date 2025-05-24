import type { LucideProps } from "lucide-react";

export function IntroItem({
  icon: Icon,
  content,
  href,
}: {
  icon: React.ComponentType<LucideProps>;
  content: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center gap-4 font-mono text-sm">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-lg border bg-zinc-50 shadow-xs dark:bg-zinc-900"
        aria-hidden="true"
      >
        <Icon className="pointer-events-none size-4 text-muted-foreground" />
      </span>

      <p className="text-balance">
        {href ? (
          <a
            className="decoration-ring underline-offset-4 hover:underline"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </p>
    </div>
  );
}
