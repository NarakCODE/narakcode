import { BriefcaseIcon, CodeXmlIcon, SparklesIcon } from "lucide-react"

import type { ExperienceItemType } from "@/registry/transformed/components/work-experience"
import { WorkExperience } from "@/registry/transformed/components/work-experience"

export default function WorkExperienceDemo() {
  return <WorkExperience className="w-full" experiences={WORK_EXPERIENCE} />
}

const WORK_EXPERIENCE: ExperienceItemType[] = [
  {
    id: "stark-industries",
    companyName: "Stark Industries",
    companyWebsite: "https://starkindustries.com",
    positions: [
      {
        id: "sr-se",
        title: "Senior Software Engineer",
        employmentPeriod: {
          start: "01.2023",
        },
        employmentType: "Full-time",
        icon: <SparklesIcon />,
        description: `- Architected and deployed a highly scalable serverless platform.
- Mentored junior engineers and led sprint planning sessions.
- Reduced database query times by 40% by implementing Redis caching and optimizing Postgres indices.
- Integrated AI-driven automated code review workflows to increase development efficiency.`,
        skills: [
          "React",
          "TypeScript",
          "Node.js",
          "AWS",
          "Redis",
          "PostgreSQL",
        ],
        isExpanded: true,
      },
      {
        id: "se",
        title: "Software Engineer",
        employmentPeriod: {
          start: "06.2021",
          end: "12.2022",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: `- Built interactive dashboard components using React and D3.js.
- Developed reusable UI elements for the internal design system.
- Maintained 90%+ test coverage using Jest and React Testing Library.`,
        skills: ["JavaScript", "React", "D3.js", "Tailwind CSS", "Jest"],
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "acme-corp",
    companyName: "Acme Corporation",
    companyWebsite: "https://acme.com",
    positions: [
      {
        id: "frontend-intern",
        title: "Frontend Developer",
        employmentPeriod: {
          start: "01.2020",
          end: "05.2021",
        },
        employmentType: "Contract",
        icon: <BriefcaseIcon />,
        description: `- Developed e-commerce web applications using Vue.js and Nuxt.js.
- Collaborated with UX/UI designers to convert Figma designs into pixel-perfect pages.
- Handled SEO optimizations and accessibility compliance (WCAG AA).`,
        skills: ["Vue.js", "Nuxt.js", "HTML5", "CSS3", "SEO"],
      },
    ],
  },
]
