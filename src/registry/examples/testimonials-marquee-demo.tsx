import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/registry/transformed/components/testimonial"

export default function TestimonialsMarqueeDemo() {
  return (
    <div className="w-full bg-background">
      <Marquee
        data-slot="marquee"
        className="border-y border-line [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
      >
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />

        <MarqueeContent>
          {TESTIMONIALS.map((item) => (
            <MarqueeItem
              key={item.url}
              className="mx-0 h-full w-xs border-r border-line"
            >
              <a
                className="block h-full transition-[background-color] ease-out hover:bg-accent/20"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Testimonial>
                  <TestimonialQuote className="font-serif">
                    <p>{item.quote}</p>
                  </TestimonialQuote>

                  <TestimonialAuthor>
                    <TestimonialAvatar>
                      <TestimonialAvatarImg src={item.authorAvatar} />
                      <TestimonialAvatarRing />
                    </TestimonialAvatar>

                    <TestimonialAuthorName>
                      {item.authorName}
                    </TestimonialAuthorName>

                    <TestimonialAuthorTagline>
                      {item.authorTagline}
                    </TestimonialAuthorTagline>
                  </TestimonialAuthor>
                </Testimonial>
              </a>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  )
}

const TESTIMONIALS = [
  {
    authorAvatar: "https://unavatar.io/x/rauchg",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO @Vercel",
    url: "#",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
  },
  {
    authorAvatar: "https://unavatar.io/x/orcdev",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "#",
    quote:
      "Seriously, this is one of the best portfolio templates I’ve ever seen.",
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
    authorAvatar: "https://unavatar.io/x/steventey",
    authorName: "Steven Tey",
    authorTagline: "Founder @Dub.co",
    url: "#",
    quote: "whoa, this is really dope – needs to get added to @shadcn UI",
  },
  {
    authorAvatar: "https://unavatar.io/x/kapehe_ok",
    authorName: "Kap",
    authorTagline: "Head of Developer Community @Vercel",
    url: "#",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar: "https://unavatar.io/x/initjean",
    authorName: "Jean P.D. Meijer",
    authorTagline: "Design Engineer",
    url: "#",
    quote:
      "congrats you deserve it! react wheel picker is so smooth, its insane",
  },
  {
    authorAvatar: "https://unavatar.io/x/GithubProjects",
    authorName: "GitHub Projects Community",
    authorTagline: "UNOFFICIAL, but followed by @github",
    url: "#",
    quote:
      "Everything you’d want in a picker, minus the styling headaches. Awesome job!",
  },
]
