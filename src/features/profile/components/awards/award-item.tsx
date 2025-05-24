import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import React from "react";

import { Markdown } from "@/components/markdown";
import { Prose } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

import type { Award } from "../../types/awards";

export function AwardItem({
  className,
  award,
}: {
  className?: string;
  award: Award;
}) {
  const canExpand = Boolean(award?.description);

  return (
    <AccordionPrimitive.Item value={award.id} disabled={!canExpand} asChild>
      <div className={cn("flex items-center", className)}>
        <div
          className="mx-4 flex size-6 shrink-0 items-center justify-center text-muted-foreground"
          aria-hidden="true"
        >
          <svg
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M216,96A88,88,0,1,0,72,163.83V240a8,8,0,0,0,11.58,7.16L128,225l44.43,22.21A8.07,8.07,0,0,0,176,248a8,8,0,0,0,8-8V163.83A87.85,87.85,0,0,0,216,96ZM56,96a72,72,0,1,1,72,72A72.08,72.08,0,0,1,56,96Zm16,0a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
          </svg>
        </div>

        <div className="flex-1 border-l border-dashed border-edge">
          <AccordionPrimitive.Trigger className="group/award flex w-full items-center justify-between gap-4 px-2 py-4 text-left select-none [&[data-state=open]_.lucide-chevron-down]:rotate-180">
            <div>
              <h3 className="mb-1 font-heading leading-snug font-medium text-balance decoration-ring underline-offset-4 group-hover/award:underline group-disabled/award:no-underline">
                {award.title}
              </h3>

              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground">
                <span>{award.prize}</span>

                <span className="flex h-4 w-px shrink-0 bg-border" />
                <span>{dayjs(award.date).format("MM.YYYY")}</span>

                <span className="flex h-4 w-px shrink-0 bg-border" />
                <span>{award.grade}</span>
              </p>
            </div>

            {canExpand && (
              <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-300" />
            )}
          </AccordionPrimitive.Trigger>

          {canExpand && (
            <AccordionPrimitive.Content className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              {award?.description && (
                <Prose className="px-2 pb-4">
                  <Markdown>{award.description}</Markdown>
                </Prose>
              )}
            </AccordionPrimitive.Content>
          )}
        </div>
      </div>
    </AccordionPrimitive.Item>
  );
}
