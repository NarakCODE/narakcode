import { Accordion as AccordionPrimitive } from "radix-ui";
import React from "react";

import { EXPERIENCES } from "../../data/experiences";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ExperienceItem } from "./experience-item";

export function Experiences() {
  const defaultValue = EXPERIENCES.flatMap((exp) =>
    exp.positions.filter((pos) => pos.expanded).map((pos) => pos.id)
  );

  return (
    <Panel id="experience" className="scroll-mt-22">
      <PanelHeader>
        <PanelTitle>Experience</PanelTitle>
      </PanelHeader>

      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={defaultValue}
        asChild
      >
        <div className="pr-2 pl-4">
          {EXPERIENCES.map((experience, index) => {
            return <ExperienceItem key={index} experience={experience} />;
          })}
        </div>
      </AccordionPrimitive.Root>
    </Panel>
  );
}
