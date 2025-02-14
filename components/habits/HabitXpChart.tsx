import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  //   ChartTooltip,
  //   ChartTooltipContent,
} from "@/components/ui/chart";
import { Habit } from "@models/types";

export const description = "A line chart";

export function HabitXpChart({ habit }: { habit: Habit }) {
  const chartData = habit.xpData.map(([date, xp]) => ({
    day: date,
    value: xp,
  }));
  const chartConfig = {
    value: {
      label: "XP",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-10">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {/* <CartesianGrid vertical={false} /> */}
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          //   tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        /> */}
        <Line
          dataKey="value"
          type="natural"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
