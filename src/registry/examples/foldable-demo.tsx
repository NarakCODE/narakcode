import { Fragment } from "react"
import type { ReactNode } from "react"

import { ChanhDaiMark } from "@/components/chanhdai-mark"
import {
  Foldable,
  FoldableCover,
  FoldableInsideLeft,
  FoldableInsideRight,
  FoldableSlider,
  FoldableStage,
} from "@/registry/components/foldable"

const PROFILE = {
  username: "NarakCODE",
  displayName: "NarakCODE",
  jobTitle: "Software Developer",
  bio: "Creating with code, driven by passion.",
  pronouns: "he/him",
  avatar: "/images/avatar-profile.jpg",
}

const CONTACTS = [
  { label: "Web", value: "narakcode.dev" },
  { label: "GitHub", value: "NarakCODE" },
  { label: "Location", value: "Phnom Penh" },
  { label: "Timezone", value: "UTC+7" },
]

export default function FoldableDemo() {
  return (
    <Foldable className="[--foldable-radius:--spacing(8)] [--foldable-surface:var(--card)] [--foldable-w:min(16rem,calc(50vw-2rem))]">
      <FoldableStage>
        <FoldableInsideRight>
          <CardFrame>
            <ContactList />
          </CardFrame>
        </FoldableInsideRight>
        <FoldableCover>
          <CardFrame />
        </FoldableCover>
        <FoldableInsideLeft>
          <CardInside />
        </FoldableInsideLeft>
      </FoldableStage>

      <FoldableSlider />
    </Foldable>
  )
}

/**
 * Shared by the cover and the page beneath it, so what the lifting cover
 * uncovers lines up with what it just showed.
 */
function CardFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="flex size-full flex-col p-6">
      <div className="flex items-start justify-between">
        <ChanhDaiMark className="size-5" />
        <span className="font-mono text-xs text-muted-foreground">
          @{PROFILE.username}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">{children}</div>

      <div>
        <p className="text-xl font-medium tracking-tight">
          {PROFILE.displayName}
        </p>
        <p className="text-sm text-muted-foreground">{PROFILE.jobTitle}</p>
      </div>
    </div>
  )
}

function ContactList() {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs">
      {CONTACTS.map(({ label, value }) => (
        <Fragment key={label}>
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="truncate text-right">{value}</dd>
        </Fragment>
      ))}
    </dl>
  )
}

function CardInside() {
  return (
    <div className="flex size-full flex-col justify-between p-6">
      <img
        className="size-16 rounded-full border object-cover"
        src={PROFILE.avatar}
        alt=""
        draggable={false}
      />

      <div className="flex flex-col gap-2">
        <p className="text-lg/snug font-medium tracking-tight text-balance">
          {PROFILE.bio}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {PROFILE.pronouns}
        </p>
      </div>
    </div>
  )
}
