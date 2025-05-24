export type ExperiencePositionIcon =
  | "code"
  | "design"
  | "education"
  | "business"
  | "school"
  | "idea";

export type ExperiencePosition = {
  id: string;
  title: string;
  year: string;
  employmentType?: string;
  description?: string;
  icon?: ExperiencePositionIcon;
  skills?: string[];
  expanded?: boolean;
};

export type Experience = {
  company: string;
  companyLogo?: string;
  positions: ExperiencePosition[];
  current?: boolean;
};
