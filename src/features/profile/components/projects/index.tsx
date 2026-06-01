"use client";

import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { PROJECTS } from "../../data/projects";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ProjectItem } from "./project-item";

export function Projects() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const max = 3;

  return (
    <Panel id="projects" className="scroll-mt-22">
      <PanelHeader>
        <PanelTitle>
          Projects
          <sup className="ml-1 font-mono text-sm text-muted-foreground select-none">
            ({PROJECTS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {PROJECTS.slice(0, max).map((item) => (
          <ProjectItem
            key={item.id}
            project={item}
            isHovered={hoveredId === item.id}
            isOtherHovered={hoveredId !== null && hoveredId !== item.id}
            onHoverStart={() => setHoveredId(item.id)}
            onHoverEnd={() => setHoveredId(null)}
          />
        ))}

        <CollapsibleContent>
          {PROJECTS.slice(max).map((item) => (
            <ProjectItem
              key={item.id}
              project={item}
              isHovered={hoveredId === item.id}
              isOtherHovered={hoveredId !== null && hoveredId !== item.id}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          ))}
        </CollapsibleContent>

        {PROJECTS.length > max && (
          <div className="flex h-12 items-center justify-center pb-px">
            <CollapsibleTrigger asChild>
              <Button
                className="group/collapsible-trigger flex"
                variant="secondary"
              >
                <span className="hidden group-data-[state=closed]/collapsible-trigger:block">
                  Show More
                </span>
                <span className="hidden group-data-[state=open]/collapsible-trigger:block">
                  Show Less
                </span>
                <ChevronDownIcon className="group-data-[state=open]/collapsible-trigger:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>
        )}
      </Collapsible>
    </Panel>
  );
}
