"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";

import { Tag } from "@/components/ui/tag";
import { UTM_PARAMS } from "@/config/site";
import { cn } from "@/lib/cn";
import { addQueryParams } from "@/utils/url";

import type { Project } from "../../types/projects";

const COLLAPSED_HEIGHT = 68;
const EXPANDED_HEIGHT = 320;

export function ProjectItem({
  className,
  project,
  isHovered: controlledIsHovered,
  isOtherHovered,
  onHoverStart,
  onHoverEnd,
}: {
  className?: string;
  project: Project;
  isHovered?: boolean;
  isOtherHovered?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  const [localIsHovered, setLocalIsHovered] = useState(false);
  const isHovered =
    controlledIsHovered !== undefined ? controlledIsHovered : localIsHovered;

  const handleHoverStart = () => {
    setLocalIsHovered(true);
    onHoverStart?.();
  };

  const handleHoverEnd = () => {
    setLocalIsHovered(false);
    onHoverEnd?.();
  };

  return (
    <motion.div
      className={cn(
        "relative w-full cursor-default overflow-hidden",
        className
      )}
      animate={{
        height: isHovered ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        opacity: isOtherHovered ? 0.38 : 1,
      }}
      transition={{
        height: {
          type: "spring",
          stiffness: 280,
          damping: 32,
          mass: 0.9,
        },
        opacity: { duration: 0.22, ease: "easeOut" },
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {project.image ? (
        <motion.div
          className="absolute inset-0 h-full w-full"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 1.06,
          }}
          transition={{
            opacity: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
            scale: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
          }}
        >
          <iframe
            src={project.image}
            className="pointer-events-none size-full border-0"
            title={project.title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 h-full w-full"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            opacity: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
          }}
        >
          <div className="size-full bg-gradient-to-br from-muted/50 via-muted/30 to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        </motion.div>
      )}

      <div className="absolute inset-0 flex items-end px-5 pb-4">
        <div className="flex w-full items-end justify-between gap-4">
          <div className="flex min-w-0 items-baseline gap-3">
            <motion.span
              className="shrink-0 text-xs tabular-nums opacity-40"
              animate={{
                color: isHovered ? "#ffffff" : "currentColor",
                opacity: isHovered ? 0.5 : 0.4,
              }}
              transition={{ duration: 0.2 }}
            >
              {project.logo ? (
                <Image
                  src={project.logo}
                  alt={project.title}
                  width={20}
                  height={20}
                  className="size-5 object-contain"
                />
              ) : (
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  aria-hidden="true"
                >
                  <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z" />
                </svg>
              )}
            </motion.span>

            <motion.span
              className="truncate font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
              animate={{
                color: isHovered ? "#ffffff" : "currentColor",
              }}
              transition={{ duration: 0.2 }}
            >
              <a
                href={addQueryParams(project.link, UTM_PARAMS)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 decoration-ring underline-offset-4 hover:underline"
              >
                {project.title}
                <motion.span
                  animate={{ x: isHovered ? 2 : 0, y: isHovered ? -2 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="inline-flex shrink-0"
                >
                  <ArrowUpRightIcon className="pointer-events-none size-4 text-muted-foreground" />
                </motion.span>
              </a>
            </motion.span>

            {project.description && (
              <motion.span
                className="hidden truncate text-sm text-white/70 sm:block"
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -8,
                }}
                transition={{
                  duration: 0.3,
                  delay: isHovered ? 0.12 : 0,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                — {project.description}
              </motion.span>
            )}
          </div>

          {project.time && (
            <motion.span
              className="shrink-0 font-mono text-xs tracking-widest uppercase"
              animate={{
                color: isHovered ? "rgba(255,255,255,0.55)" : "currentColor",
                opacity: isHovered ? 1 : 0.45,
              }}
              transition={{ duration: 0.2 }}
            >
              {project.time}
            </motion.span>
          )}
        </div>
      </div>

      {Array.isArray(project.tags) && project.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 8,
          }}
          transition={{
            duration: 0.3,
            delay: isHovered ? 0.15 : 0,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="absolute right-5 bottom-16 left-5 flex flex-wrap gap-1.5"
        >
          {project.tags.map((skill, index) => (
            <Tag key={index} variant="secondary">
              {skill}
            </Tag>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
