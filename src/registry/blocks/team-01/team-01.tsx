import { Avatar, Style } from "@dicebear/core"
import glass from "@dicebear/styles/glass.json"

import { GlowCard, GlowCardGrid } from "@/registry/components/glow-card-grid"

const glassStyle = new Style(glass)

export default function Team01() {
  return (
    <div className="container px-4 py-8">
      <GlowCardGrid className="lg:grid-cols-4">
        {CARDS.map((card) => (
          <GlowCard
            key={card.name}
            name={card.name}
            handle={card.handle}
            avatar={new Avatar(glassStyle, {
              seed: card.name,
              size: 80,
            }).toDataUri()}
          />
        ))}
      </GlowCardGrid>
    </div>
  )
}

const CARDS = [
  {
    name: "shadcn",
    handle: "@shadcn",
  },
  {
    name: "Evil Rabbit",
    handle: "@evilrabbit_",
  },
  {
    name: "OrcDev",
    handle: "@orcdev",
  },
  {
    name: "David Haz",
    handle: "@davidhdev",
  },
  {
    name: "Shu",
    handle: "@shuding",
  },
  {
    name: "Emil Kowalski",
    handle: "@emilkowalski",
  },
  {
    name: "Aaron",
    handle: "@aaronmahlke",
  },
  {
    name: "NarakCODE",
    handle: "@iamNarakCODE",
  },
]
