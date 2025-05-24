import dayjs from "dayjs";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

import { cn } from "@/lib/cn";

import type { Certification } from "../../types/certifications";

export function CertificationItem({
  className,
  certification,
}: {
  className?: string;
  certification: Certification;
}) {
  return (
    <a
      className={cn("group/cert flex items-center pr-2", className)}
      href={certification.credentialURL}
      target="_blank"
      rel="noopener"
    >
      {certification.issuerLogo ? (
        <Image
          src={certification.issuerLogo}
          alt={certification.issuer}
          width={32}
          height={32}
          quality={100}
          className="mx-4 flex size-6 shrink-0"
        />
      ) : (
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
            <path d="M232,86.53V56a16,16,0,0,0-16-16H40A16,16,0,0,0,24,56V184a16,16,0,0,0,16,16H160v24A8,8,0,0,0,172,231l24-13.74L220,231A8,8,0,0,0,232,224V161.47a51.88,51.88,0,0,0,0-74.94ZM128,144H72a8,8,0,0,1,0-16h56a8,8,0,0,1,0,16Zm0-32H72a8,8,0,0,1,0-16h56a8,8,0,0,1,0,16Zm88,98.21-16-9.16a8,8,0,0,0-7.94,0l-16,9.16V172a51.88,51.88,0,0,0,40,0ZM196,160a36,36,0,1,1,36-36A36,36,0,0,1,196,160Z"></path>
          </svg>
        </div>
      )}

      <div className="flex-1 space-y-1 border-l border-dashed border-edge px-2 py-4">
        <h3 className="font-heading leading-snug font-medium text-balance decoration-ring underline-offset-4 group-hover/cert:underline">
          {certification.title}
        </h3>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground">
          <span>
            @<span className="ml-0.5">{certification.issuer}</span>
          </span>

          <span className="flex h-4 w-px shrink-0 bg-border" />
          <span>{dayjs(certification.issueDate).format("DD.MM.YYYY")}</span>
        </p>
      </div>

      {certification.credentialURL && (
        <ArrowUpRightIcon className="size-4 text-muted-foreground" />
      )}
    </a>
  );
}
