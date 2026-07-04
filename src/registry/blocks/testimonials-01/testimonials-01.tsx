import type { TestimonialType } from "@/registry/blocks/testimonials-01/components/testimonial-list"
import { TestimonialList } from "@/registry/blocks/testimonials-01/components/testimonial-list"

export default function Testimonials01() {
  return (
    <div className="flex flex-col gap-2 [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
      <TestimonialList data={TESTIMONIALS_1} />
      <TestimonialList data={TESTIMONIALS_2} direction="right" />
    </div>
  )
}

const TESTIMONIALS_1: TestimonialType[] = [
  {
    authorAvatar: "https://unavatar.io/x/kapehe_ok",
    authorName: "Kap",
    authorTagline: "Head of Developer Community @Vercel",
    url: "#",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar: "https://unavatar.io/x/rauchg",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO @Vercel",
    url: "#",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
  },
  {
    authorAvatar: "https://unavatar.io/x/iamsahaj_xyz",
    authorName: "Sahaj",
    authorTagline: "Creator of tweakcn.com",
    url: "#",
    quote:
      "remember seeing it on @mannupaaji’s review. it’s one of the best looking ones I’ve seen",
  },
  {
    authorAvatar: "https://unavatar.io/x/FrancescoCiull4",
    authorName: "Francesco Ciulla",
    authorTagline: "Developer Advocate @daily.dev",
    url: "#",
    quote:
      "your portfolio is stunning. i created mine some weeks ago but this is another planet.",
  },
  {
    authorAvatar: "https://unavatar.io/x/orcdev",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "#",
    quote: "@iamNarakCODE is one of the best design engineers!",
  },
  {
    authorAvatar: "https://unavatar.io/x/shadcncraft?v=2",
    authorName: "shadcncraft",
    authorTagline: "shadcncraft.com",
    url: "#",
    quote: "Love your work Dai! You’re a great talent :-)",
  },
  {
    authorAvatar: "https://unavatar.io/x/khushiirl",
    authorName: "khushi.vy",
    authorTagline: "Software Engineer",
    url: "#",
    quote: "Goated portfolio. I love the whole UI in Vercel style",
  },
  {
    authorAvatar: "https://unavatar.io/x/dimicx",
    authorName: "dimi",
    authorTagline: "Design Engineer",
    url: "#",
    quote:
      "i like this subtle version a lot more than the over-the-top examples i see everywhere, very nice",
  },
]

const TESTIMONIALS_2: TestimonialType[] = [
  {
    authorAvatar: "https://unavatar.io/x/MaxPrilutskiy",
    authorName: "Max Prilutskiy",
    authorTagline: "CEO @Lingo.dev",
    url: "#",
    quote: "i like your style! :)",
  },
  {
    authorAvatar: "https://unavatar.io/x/jordwalke",
    authorName: "jordwalke",
    authorTagline: "Creator of React",
    url: "#",
    quote: "Looks great",
  },
  {
    authorAvatar: "https://unavatar.io/x/mannupaaji",
    authorName: "Manu Arora",
    authorTagline: "Creator of ui.aceternity.com",
    url: "#",
    quote: "Great work on the portfolio",
  },
  {
    authorAvatar: "https://unavatar.io/x/ajaypatel_aj",
    authorName: "Ajay Patel",
    authorTagline: "Creator of shadcnstudio.com",
    url: "#",
    quote: "This Portfolio is something else",
  },
  {
    authorAvatar: "https://unavatar.io/x/davidhdev",
    authorName: "David Haz",
    authorTagline: "Creator of reactbits.dev",
    url: "#",
    quote: "Simple and clean, love it!",
  },
  {
    authorAvatar: "https://unavatar.io/x/uixmat",
    authorName: "Matt",
    authorTagline: "Creator of ui.bklit.com",
    url: "#",
    quote: "great work bro",
  },
  {
    authorAvatar: "https://unavatar.io/x/branmcconnell",
    authorName: "Brandon McConnell",
    authorTagline: "Frontend Engineer @mintlify",
    url: "#",
    quote: "amazing, such cool libraries",
  },
  {
    authorAvatar: "https://unavatar.io/x/shadcn",
    authorName: "shadcn",
    authorTagline: "Creator of shadcn/ui",
    url: "#",
    quote: "You’re doing amazing work.",
  },
  {
    authorAvatar: "https://unavatar.io/x/joshpuckett",
    authorName: "joshpuckett",
    authorTagline: "Teaching at interfacecraft.dev",
    url: "#",
    quote: "Yooo I love this 🎨",
  },
]
