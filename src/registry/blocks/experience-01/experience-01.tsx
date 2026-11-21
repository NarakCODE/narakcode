import { Avatar, Style } from "@dicebear/core"
import glass from "@dicebear/styles/glass.json"
import { CodeXmlIcon, LightbulbIcon } from "lucide-react"

import type { ExperienceItemType } from "@/registry/components/work-experience"
import { WorkExperience } from "@/registry/components/work-experience"

const glassStyle = new Style(glass)

export function Experience01() {
  return (
    <div className="max-w-screen overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="border-x border-line py-8">
          <h2 className="screen-line-top screen-line-bottom ml-4 font-heading text-3xl font-medium tracking-tight">
            Experience
          </h2>

          <WorkExperience
            className="bg-transparent *:screen-line-bottom"
            experiences={EXPERIENCE}
          />
        </div>
      </div>
    </div>
  )
}

const EXPERIENCE: ExperienceItemType[] = [
  {
    id: "shadcncraft",
    companyName: "shadcncraft",
    companyLogo: new Avatar(glassStyle, {
      seed: "shadcncraft",
      size: 24,
    }).toDataUri(),
    companyWebsite: "https://shadcncraft.com",
    positions: [
      {
        id: "1",
        title: "Design Engineer",
        employmentPeriod: {
          start: "01.2026",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description:
          "- Work on the registry and React component library.\n- Design and build Pro application components and blocks, from Figma to production-ready React.",
        skills: [
          "TypeScript",
          "Next.js",
          "Tailwind CSS",
          "shadcn/registry",
          "Figma",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "kbach-studio",
    companyName: "Kbach Studio",
    companyLogo: new Avatar(glassStyle, {
      seed: "Kbach Studio",
      size: 24,
    }).toDataUri(),
    companyWebsite: "https://narakcode.dev",
    positions: [
      {
        id: "2",
        title: "Design Engineer",
        employmentPeriod: {
          start: "03.2024",
        },
        employmentType: "Part-time",
        icon: <CodeXmlIcon />,
        description: `- Integrated Bakong KHQR and Stripe for fast, secure payments across Cambodia.
- Built Khmer-localized web applications and reusable React design systems.
- Shipped developer tools and interactive dashboards with Next.js and TypeScript.
- Maintained automated CI/CD pipelines, containerized deployments, and edge caching.`,
        skills: [
          "Next.js",
          "React",
          "TypeScript",
          "KHQR",
          "Bakong",
          "Stripe",
          "Docker",
          "Tailwind CSS",
          "Localization",
        ],
      },
      {
        id: "1",
        title: "Founder",
        employmentPeriod: {
          start: "03.2024",
        },
        employmentType: "Part-time",
        icon: <LightbulbIcon />,
        skills: ["Product Strategy", "Engineering Leadership", "Operations"],
      },
    ],
    isCurrentEmployer: true,
  },
]
