import { LogosCarousel } from "@/registry/components/logos-carousel"
import { SPONSORS } from "@/features/sponsor/data"

export default function LogosCarouselDemo() {
  return (
    <LogosCarousel className="w-full text-foreground">
      {SPONSORS.map((sponsor, index) => (
        <sponsor.logo key={index} className="h-auto w-full scale-105" />
      ))}
    </LogosCarousel>
  )
}
