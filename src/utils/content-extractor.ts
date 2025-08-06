import { USER } from "@/data/user";

export function extractPortfolioContent(): string {
  // Decode base64 encoded contact info safely
  let email = "[email protected]";
  let phone = "+1234567890";

  try {
    if (typeof window !== "undefined") {
      email = atob(USER.email);
      phone = atob(USER.phoneNumber);
    }
  } catch (error) {
    // Fallback for server-side rendering or invalid base64
    console.warn("Failed to decode contact info:", error);
  }

  const content = `
**Personal Information:**
Name: ${USER.displayName} (${USER.firstName} ${USER.lastName})
Location: ${USER.address}
Bio: ${USER.bio}
Professional Roles: ${USER.flipSentences.join(", ")}

**Current Position:**
${USER.jobs.map((job) => `${job.title} at ${job.company}`).join(", ")}

**About:**
${USER.about}

**Contact:**
Website: ${USER.website}
Email: ${email}
Phone: ${phone}

**Professional Focus:**
${USER.jobTitle}

**Key Attributes:**
- ${USER.flipSentences.join("\n- ")}

**Career Started:** ${USER.dateCreated}
**Date of Birth:** ${USER.dateOfBirth}
`;

  return content.trim();
}
