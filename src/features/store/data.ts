export const GEMINI_LOGO_URL =
  "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_SparkIcon_.width-500.format-webp.webp"

export const STORE_CARD_BG_URL = "/images/stores/card-bg.webp"

export type PlanFeatureIconKey =
  | "gemini"
  | "flow"
  | "search"
  | "antigravity"
  | "notebook"
  | "workspace"
  | "youtube"
  | "storage"

export type ModelLogoKey = "gemini" | "claude" | "openai"

export interface PlanSubFeatureItem {
  label: string
  logo: ModelLogoKey
}

export interface PlanFeatureItem {
  id: string
  icon: PlanFeatureIconKey
  title: string
  summary: string
  description: string
  subFeatures?: PlanSubFeatureItem[]
}

export const GEMINI_PLAN_FEATURES: PlanFeatureItem[] = [
  {
    id: "gemini-app",
    icon: "gemini",
    title: "Gemini app",
    summary:
      "Access to Gemini 4 Neon & Gemini 4 Hydrogen, 4x higher usage limits, and video generation.",
    description:
      "Access to Gemini 4 Neon and Gemini 4 Hydrogen, four times higher usage limits than Free, and video generation.",
  },
  {
    id: "google-flow",
    icon: "flow",
    title: "Google Flow",
    summary:
      "1,000 credits for AI creative studio with Gemini Omni Flash and custom tools.",
    description:
      "Get 1,000 Google Flow credits across the AI creative studio to create cinematic scenes and stories with Gemini Omni Flash and custom tool creation.",
  },
  {
    id: "google-search",
    icon: "search",
    title: "Google Search",
    summary: "Higher access to Nano Banana, agentic capabilities, and more.",
    description:
      "Higher access to Nano Banana, agentic capabilities, and more.",
  },
  {
    id: "gemini-notebook",
    icon: "notebook",
    title: "Gemini Notebook",
    summary:
      "Research and writing assistant with 5x more Audio Overviews and notebooks.",
    description:
      "Research and writing assistant with 5x more Audio Overviews, notebooks, and more.",
  },
  {
    id: "google-apps",
    icon: "workspace",
    title: "Gemini in Gmail, Docs, Vids and more",
    summary: "Access Gemini directly in Google apps.",
    description: "Access Gemini directly in Gmail, Docs, Vids, and more.",
  },
  {
    id: "youtube-premium-lite",
    icon: "youtube",
    title: "YouTube Premium Lite individual plan",
    summary: "Most videos ad-free, offline, and in the background.",
    description: "Most videos ad-free, offline, and in the background.",
  },
  {
    id: "storage",
    icon: "storage",
    title: "5 TB storage",
    summary: "5 TB of cloud storage across Gmail, Drive, and Photos.",
    description: "5 TB of cloud storage across Gmail, Drive, and Photos.",
  },
  {
    id: "google-antigravity",
    icon: "antigravity",
    title: "Google Antigravity",
    summary: "Entry rate limits to agent models in Google Antigravity.",
    description:
      "Entry rate limits to agent models in Google Antigravity, the agentic development platform.",
    subFeatures: [
      { label: "Gemini 4 Neon", logo: "gemini" },
      { label: "Gemini 4 Carbon", logo: "gemini" },
      { label: "Gemini 4 Argon", logo: "gemini" },
      { label: "Gemini 4 Hydrogen", logo: "gemini" },
      { label: "Orchestrator Gemini", logo: "gemini" },
      { label: "Gemini 3.8 Flash", logo: "gemini" },
      { label: "Claude Opus 5.5", logo: "claude" },
      { label: "Claude Sonnet 5.5", logo: "claude" },
      { label: "GPT-OSS 120B", logo: "openai" },
    ],
  },
]
