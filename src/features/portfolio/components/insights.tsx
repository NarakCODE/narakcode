import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import XAxis from "@/components/charts/x-axis"
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
          Insights<PanelTitleSup>[unique_visitors]</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      {data.length > 0 ? (
        <LineChart
          data={data}
          animationDuration={1100}
          animationEasing="cubic-bezier(0.85, 0, 0.15, 1)"
          aspectRatio="3/1"
        >
          <Grid horizontal />
          <Line dataKey="unique_visitors" />
          <XAxis />
          <ChartTooltip />
        </LineChart>
      ) : (
        <div className="grid aspect-3/1 w-full place-content-center">
          <p className="text-muted-foreground">No insights available.</p>
        </div>
      )}
    </Panel>
  )
}
