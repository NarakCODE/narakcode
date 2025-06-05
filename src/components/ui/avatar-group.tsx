"use client";

import { motion, type Transition } from "motion/react";
import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
  type TooltipProps,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/animate-ui/components/tooltip";
import { cn } from "@/lib/cn";

type AvatarProps = TooltipProps & {
  children: React.ReactNode;
  zIndex: number;
  transition: Transition;
  translate: string | number;
};

function AvatarContainer({
  children,
  zIndex,
  transition,
  translate,
  ...props
}: AvatarProps) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger>
        <motion.div
          data-slot="avatar-container"
          initial="initial"
          whileHover="hover"
          whileTap="hover"
          className="relative"
          style={{ zIndex }}
        >
          <motion.div
            variants={{
              initial: { translateY: 0 },
              hover: { translateY: translate },
            }}
            transition={transition}
          >
            {children}
          </motion.div>
        </motion.div>
      </TooltipTrigger>
    </Tooltip>
  );
}

type AvatarGroupTooltipProps = TooltipContentProps;

function AvatarGroupTooltip(props: AvatarGroupTooltipProps) {
  return <TooltipContent {...props} />;
}

type AvatarGroupProps = Omit<React.ComponentProps<"div">, "translate"> & {
  children: React.ReactElement[];
  transition?: Transition;
  invertOverlap?: boolean;
  translate?: string | number;
  tooltipProps?: Omit<TooltipProps, "children">;
};

function AvatarGroup({
  ref,
  children,
  className,
  transition = { type: "spring", stiffness: 300, damping: 17 },
  invertOverlap = false,
  translate = "-30%",
  tooltipProps = { side: "top", sideOffset: 24 },
  ...props
}: AvatarGroupProps) {
  return (
    <TooltipProvider openDelay={0} closeDelay={0}>
      <div
        ref={ref}
        data-slot="avatar-group"
        className={cn("flex h-8 flex-row items-center -space-x-2", className)}
        {...props}
      >
        {children?.map((child, index) => (
          <AvatarContainer
            key={index}
            zIndex={
              invertOverlap ? React.Children.count(children) - index : index
            }
            transition={transition}
            translate={translate}
            {...tooltipProps}
          >
            {child}
          </AvatarContainer>
        ))}
      </div>
    </TooltipProvider>
  );
}

export {
  AvatarGroup,
  type AvatarGroupProps,
  AvatarGroupTooltip,
  type AvatarGroupTooltipProps,
};
