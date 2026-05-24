import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { getInsights } from "@/features/portfolio/data/insights"

export async function Insights() {
  const data = await getInsights()

  return (
    <Panel id="insights">
      <PanelHeader>
        <PanelTitle>
          Insights<PanelTitleSup>[Unique Visitors]</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      {data.length > 0 ? (
        <LineChart
          className="sm:aspect-3/1!"
          data={data}
          margin={{ top: 16, right: 32, bottom: 40, left: 32 }}
        >
          <Grid horizontal />
          <Line dataKey="unique_visitors" strokeWidth={2} />
          <ChartTooltip rowLabels={{ unique_visitors: "Unique Visitors" }} />
        </LineChart>
      ) : (
        <div className="grid aspect-2/1 w-full place-content-center sm:aspect-3/1">
          <p className="text-muted-foreground">No insights available.</p>
        </div>
      )}
    </Panel>
  )
}
