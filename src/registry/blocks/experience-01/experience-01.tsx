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
    id: "quaric",
    companyName: "Quaric",
    companyLogo: new Avatar(glassStyle, {
      seed: "Quaric",
      size: 24,
    }).toDataUri(),
    companyWebsite: "https://quaric.com",
    positions: [
      {
        id: "2",
        title: "Design Engineer",
        employmentPeriod: {
          start: "03.2024",
        },
        employmentType: "Part-time",
        icon: <CodeXmlIcon />,
        description: `- Integrated VNPAY-QR for secure transactions.
- Registered the e-commerce site with [online.gov.vn](https://online.gov.vn) for compliance.
- Developed online ordering to streamline purchases.
- Build and maintain ZaDark.com with Docusaurus, integrating AdSense.
- Develop and maintain the ZaDark extension for Zalo Web on Chrome, Safari, Edge, and Firefox — with 15,000+ active users via Chrome Web Store.`,
        skills: [
          "Next.js",
          "Strapi",
          "Auth0",
          "VNPAY-QR",
          "Docker",
          "NGINX",
          "Google Cloud",
          "Docusaurus",
          "Extension",
          "Research",
          "Project Management",
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
        skills: ["Business Ownership", "Business Law", "Business Tax"],
      },
    ],
    isCurrentEmployer: true,
  },
]
