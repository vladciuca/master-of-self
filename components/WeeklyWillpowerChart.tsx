"use client";

import { useEffect, useState, useRef } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  ResponsiveContainer,
  LabelList,
  Rectangle,
  LabelProps,
  RectangleProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "./ui/skeleton";
import { FaBoltLightning } from "react-icons/fa6";

type WillpowerData = {
  date: string;
  generatedWillpower: number;
  bonusWillpower: number;
  willpowerLabelValue?: string;
};

type WillpowerChartBaseProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
};

type WillpowerLabelProps = LabelProps & WillpowerChartBaseProps;

type WillpowerBarProps = RectangleProps &
  WillpowerChartBaseProps & {
    type: "bonus" | "generated";
    payload?: WillpowerData;
  };

type WeeklyWillpowerChartProps = {
  userId?: string;
};

function WillpowerLabel(props: WillpowerLabelProps) {
  const { x = 0, y = 0, width = 0, value } = props;
  const labelHeight = 20;
  const fontSize = 14;
  const spacing = 1;

  const [textWidth, setTextWidth] = useState({
    generatedWidth: 0,
    bonusWidth: 0,
  });
  const generatedTextRef = useRef<SVGTextElement | null>(null);
  const bonusTextRef = useRef<SVGTextElement | null>(null);

  if (!value || value === 0) {
    return;
  }

  const [generatedWillpower, bonusWillpower] = value
    .toString()
    .split(",")
    .map(Number);

  if (generatedWillpower === 0 && bonusWillpower === 0) {
    return null;
  }

  useEffect(() => {
    if (generatedTextRef.current && bonusTextRef.current) {
      const generatedWidth = generatedTextRef.current.getBBox().width;
      const bonusWidth = bonusTextRef.current.getBBox().width;
      setTextWidth({ generatedWidth, bonusWidth });
    }
  }, [value]);

  const totalWidth =
    textWidth.generatedWidth + textWidth.bonusWidth + spacing * 2;

  return (
    <g
      transform={`translate(${x + width / 2 - totalWidth / 2}, ${
        y - labelHeight
      })`}
    >
      <text
        ref={generatedTextRef}
        x="0"
        y="0"
        fill="hsl(var(--primary))"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="bold"
      >
        {generatedWillpower}
      </text>

      <text
        ref={bonusTextRef}
        x={textWidth.generatedWidth + spacing}
        y="0"
        fill="#22c55e"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="bold"
      >
        +{bonusWillpower}
      </text>
    </g>
  );
}

function WillpowerBar(props: WillpowerBarProps) {
  const { payload, type, ...rest } = props;
  const defaultRadius: [number, number, number, number] = [4, 4, 4, 4];

  const radius: [number, number, number, number] = (() => {
    if (type === "generated") {
      const bonusWillpower = payload?.bonusWillpower ?? 0;
      return bonusWillpower === 0 ? defaultRadius : [0, 0, 4, 4];
    }
    if (type === "bonus") {
      const generatedWillpower = payload?.generatedWillpower ?? 0;
      return generatedWillpower === 0 ? defaultRadius : [4, 4, 0, 0];
    }
    return defaultRadius;
  })();

  return <Rectangle {...rest} radius={radius} />;
}

function chartTimePeriod(willpowerData: { date: string }[]) {
  if (!willpowerData || willpowerData.length === 0) {
    return <Skeleton className="w-1/3 h-10" />;
  }

  const firstDateStr = willpowerData[0].date;
  const lastDateStr = willpowerData[willpowerData.length - 1].date;

  const firstDate = new Date(firstDateStr);
  const lastDate = new Date(lastDateStr);

  const startDay = firstDate.getUTCDate();
  const startMonth = firstDate
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const endDay = lastDate.getUTCDate();
  const endMonth = lastDate
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  if (startMonth === endMonth) {
    return (
      <div className="text-3xl font-bold">
        {`${startDay} - ${endDay}`}
        <span className="ml-2 text-lg font-extrabold tracking-wide">
          {startMonth}
        </span>
      </div>
    );
  } else {
    return (
      <div className="text-2xl font-bold">
        <span className="text-2xl font-bold">{startDay}</span>
        <span className="text-lg font-extrabold tracking-wide ml-1">
          {startMonth}
        </span>
        <span className="mx-2">-</span>
        <span className="text-2xl font-bold">{endDay}</span>
        <span className="text-lg font-extrabold tracking-wide ml-1">
          {endMonth}
        </span>
      </div>
    );
  }
}

export function WeeklyWillpowerChart({ userId }: WeeklyWillpowerChartProps) {
  const [willpowerData, setWillpowerData] = useState<WillpowerData[]>([]);

  const chartConfig = {
    generatedWillpower: {
      label: "Generated Willpower",
      color: "hsl(var(--primary))",
    },
    bonusWillpower: {
      label: "Bonus Willpower",
      color: "#22c55e",
    },
  };

  useEffect(() => {
    const fetchWillpowerData = async () => {
      try {
        const today = new Date();
        const localDate = today.toISOString().split("T")[0];

        const response = await fetch(
          `/api/users/${userId}/weekly-willpower?date=${localDate}`
        );
        if (!response.ok) throw new Error("Failed to fetch willpower data");
        const data = await response.json();

        const updatedData = data.map((item: WillpowerData) => ({
          ...item,
          willpowerLabelValue: `${item.generatedWillpower},${item.bonusWillpower}`,
        }));

        setWillpowerData(updatedData);
      } catch (error) {
        console.error("Error fetching willpower data:", error);
      }
    };

    fetchWillpowerData();
  }, [userId]);

  return (
    <>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Weekly Willpower"}
        </CardTitle>
        <CardDescription>
          {"Your daily and bonus Willpower generated for the current week."}
        </CardDescription>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="flex items-center">
            <FaBoltLightning className="mr-2" />
            {chartTimePeriod(willpowerData)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={willpowerData}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                  }}
                />
                <Bar
                  dataKey="generatedWillpower"
                  stackId="a"
                  fill="var(--color-generatedWillpower)"
                  shape={<WillpowerBar type="generated" />}
                />
                <Bar
                  dataKey="bonusWillpower"
                  stackId="a"
                  fill="var(--color-bonusWillpower)"
                  shape={<WillpowerBar type="bonus" />}
                >
                  <LabelList
                    dataKey="willpowerLabelValue"
                    content={<WillpowerLabel />}
                    position="top"
                  />
                </Bar>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
