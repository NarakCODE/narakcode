import { unstable_cache } from "next/cache"

type Serie = {
  date: string
  unique_visitors: number
}

type InsightsResponse = {
  series: Serie[]
}

export const getInsights = unstable_cache(
  async () => {
    try {
      const res = await fetch(
        `https://api.openpanel.dev/insights/${process.env.OPENPANEL_PROJECT_ID}/overview`,
        {
          headers: {
            "openpanel-client-id": process.env.OPENPANEL_CLIENT_ID!,
            "openpanel-client-secret": process.env.OPENPANEL_CLIENT_SECRET!,
          },
        }
      )

      if (!res.ok) {
        return []
      }

      const data = (await res.json()) as InsightsResponse
      return data.series
    } catch {
      return []
    }
  },
  ["openpanel-insights"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)
