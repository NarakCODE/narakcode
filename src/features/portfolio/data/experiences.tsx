import { CodeXmlIcon } from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "acleda",
    companyName: "ACLEDA Bank Plc.",
    companyLogo:
      "https://www.acledabank.com.kh/kh/assets/download_material/download-logo-icon.png",
    location: "Phnom Penh, Cambodia",
    locationType: "On-site",
    positions: [
      {
        id: "f0becfba-057d-40db-b252-739e1654faa1",
        title: "Junior Software Developer",
        employmentPeriod: {
          start: "2025",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: `- Developed a web application for E-Commerce platforms.
- Designed and implemented a user-friendly interface with micro frontend architecture and microservices.
- Optimized the application's performance and scalability.
- Collaborated with cross-functional teams to deliver high-quality software.
- Conducted code reviews, provided technical support, and resolved issues effectively.
- Maintained and updated the application's documentation and user manuals.
- Contributed to the development of new features and enhancements.
- Stayed up-to-date with industry trends and best practices.`,
        skills: ["Angular", "Spring Boot", "Java", "Oracle", "Docker", "NGINX"],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
]
