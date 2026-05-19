import { Check, CircleX, Copy } from "lucide-react"

import { CopyButton } from "@/registry/components/copy-button"

export default function CopyButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton
        variant="secondary"
        size="icon-sm"
        text="Text 1"
        idleIcon={<Copy />}
        doneIcon={<Check />}
        errorIcon={<CircleX />}
      />

      <CopyButton
        className="gap-1.5 pr-2.5 pl-2"
        variant="outline"
        size="sm"
        text="Text 2"
        idleIcon={<Copy />}
        doneIcon={<Check />}
        errorIcon={<CircleX />}
      >
        Copy
      </CopyButton>
    </div>
  )
}
