"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { WillpowerLabel } from "@components/profile/weekly-willpower-chart/WillpowerLabel";
import { WillpowerBar } from "@components/profile/weekly-willpower-chart/WillpowerBar";
import { Bar, BarChart, XAxis, ResponsiveContainer, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@components/ui/card";
import { ChartContainer } from "@components/ui/chart";
import { Skeleton } from "@components/ui/skeleton";
import { FaBoltLightning } from "react-icons/fa6";
import { Session } from "@app/types/types";
import { WeeklyWillpowerData } from "@app/types/types";

export type WillpowerChartBaseProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
};

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
      <div className="text-2xl font-bold">
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

export function WeeklyWillpowerChart() {
  const { data: session } = useSession() as { data: Session | null };
  const [isLoading, setIsLoading] = useState(false);
  const [willpowerData, setWillpowerData] = useState<WeeklyWillpowerData[]>([]);

  const totalWillpower = willpowerData.reduce(
    (acc, curr) => {
      acc.generated += curr.generatedWillpower;
      acc.bonus += curr.bonusWillpower;
      return acc;
    },
    { generated: 0, bonus: 0 }
  );

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
        setIsLoading(true);
        const today = new Date();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const response = await fetch(
          `/api/users/${session?.user.id}/weekly-willpower?startOfWeek=${startOfWeek}&endOfWeek=${endOfWeek}`
        );
        if (!response.ok) throw new Error("Failed to fetch willpower data");
        const data = await response.json();

        const updatedData = data.map((item: WeeklyWillpowerData) => ({
          ...item,
          willpowerLabelValue: `${item.generatedWillpower},${item.bonusWillpower}`,
        }));

        setWillpowerData(updatedData);
      } catch (error) {
        console.error("Error fetching willpower data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWillpowerData();
  }, [session]);

  return (
    <div>
      <div className="mx-1">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center">
          <span>{"Weekly Willpower"}</span>
        </CardTitle>

        <CardDescription>
          {"Your daily and bonus Willpower generated for the current week."}
        </CardDescription>
        <CardTitle className="flex items-baseline justify-between my-1 mt-2">
          <span className="text-muted-foreground">
            {chartTimePeriod(willpowerData)}
          </span>
          <span className="flex items-center text-3xl font-bold">
            {isLoading ? "??" : totalWillpower.generated}
            {!isLoading && totalWillpower.bonus > 0 && (
              <span className="text-green-500">+{totalWillpower.bonus}</span>
            )}
            <FaBoltLightning className="ml-1" />
          </span>
        </CardTitle>
      </div>

      <Card>
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
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
