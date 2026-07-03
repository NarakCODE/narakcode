import type { Education } from "@/features/portfolio/types/education"

export const EDUCATION: Education[] = [
  {
    id: "rupp",
    school: "Royal University of Phnom Penh",
    degree: "Bachelor’s degree",
    fieldOfStudy: "Computer Science",
    period: {
      start: "2021",
    },
    description: `- Currently pursuing a Bachelor's degree in Computer Science (3rd year).
- Strong foundation in programming, software development, and systems design.
- Actively involved in practical projects.
- Gained experience in Agile methodologies, team collaboration, and project management.
- Relevant awards and achievements include hackathons and coding competitions.`,
    skills: [
      "C/C++ Programming",
      "C# Programming",
      "Java Programming",
      "Math For Computer Science",
      "Statistics",
      "Networking",
      "Web Development",
      "Database Management",
      "English",
      "Team Collaboration",
    ],
  },
  {
    id: "above-beyond-bootcamp",
    school: "Above & Beyond Bootcamp",
    fieldOfStudy: "Software Development",
    period: {
      start: "2024",
      end: "2025",
    },
    description: `- Completed a 10-month full-time bootcamp focused on full-stack software development.
- Gained hands-on experience with frontend and backend frameworks.
- Practiced Agile Scrum methodology and collaborated on real-world projects.
- Developed skills in Git workflows, code reviews, continuous integration, and testing.
- Created various projects including Student attendance systems, Apple clone, and eCommerce platforms.`,
    skills: [
      "Software Development",
      "React.js",
      "Node.js",
      "Agile Methodology",
      "Git Version Control",
      "MySQL Server",
      "Python Programming",
      "Algorithms",
      "Basic Data Analysis",
      "UX/UI Design",
      "Project Management",
      "Communication Skills",
      "Teamwork",
    ],
  },
]
