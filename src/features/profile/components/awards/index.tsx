import dayjs from "dayjs";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { CollapsibleList } from "@/components/collapsible-list";

import { AWARDS } from "../../data/awards";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { AwardItem } from "./award-item";

const SORTED_AWARDS = [...AWARDS].sort((a, b) => {
  return dayjs(b.date).diff(dayjs(a.date));
});

export function Awards() {
  return (
    <Panel id="awards" className="scroll-mt-22">
      <PanelHeader>
        <PanelTitle>
          Awards
          <sup className="ml-1 font-mono text-sm text-muted-foreground select-none">
            ({AWARDS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <AccordionPrimitive.Root type="multiple">
        <CollapsibleList
          items={SORTED_AWARDS}
          max={3}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <AwardItem award={item} />}
        />
      </AccordionPrimitive.Root>
    </Panel>
  );
}
