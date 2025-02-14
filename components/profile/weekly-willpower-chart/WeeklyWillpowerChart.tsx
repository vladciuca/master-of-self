"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { WillpowerBar } from "@components/profile/weekly-willpower-chart/WillpowerBar";
import { Bar, BarChart, XAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@components/ui/card";
import { ChartContainer } from "@components/ui/chart";
import { Skeleton } from "@components/ui/skeleton";
import { FaBoltLightning } from "react-icons/fa6";
import { getStartOfCurrentWeek, getEndOfCurrentWeek } from "@lib/time";
import { journalColors } from "@components/ui/constants";
import { Session } from "@models/types";
import { WeeklyWillpowerData } from "@models/types";

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
      <div className="text-2xl font-semibold">
        {startDay}
        <span className="mx-1 text-sm">-</span>
        {endDay}
        <span className="ml-2 text-lg font-bold tracking-wide">
          {startMonth}
        </span>
      </div>
    );
  } else {
    return (
      <div className="text-2xl font-semibold">
        <span className="text-2xl font-semibold">{startDay}</span>
        <span className="text-lg font-bold tracking-wide ml-1">
          {startMonth}
        </span>
        <span className="mx-1 text-sm">-</span>
        <span className="text-2xl font-semibold">{endDay}</span>
        <span className="text-lg font-bold tracking-wide ml-1">{endMonth}</span>
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
      // color: "hsl(var(--primary))",
      color: "#EAB308",
    },
    bonusWillpower: {
      label: "Bonus Willpower",
      color: "#A855F7",
    },
  };

  useEffect(() => {
    const fetchWillpowerData = async () => {
      try {
        setIsLoading(true);

        const startOfWeek = getStartOfCurrentWeek();
        const endOfWeek = getEndOfCurrentWeek();

        const response = await fetch(
          `/api/users/${session?.user.id}/weekly-willpower?startOfWeek=${startOfWeek}&endOfWeek=${endOfWeek}`
        );
        if (!response.ok) throw new Error("Failed to fetch willpower data");
        const data = await response.json();

        setWillpowerData(data);
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
            {/* {!isLoading && totalWillpower.bonus > 0 && (
              <span className={`text-${journalColors.night}`}>
                +{totalWillpower.bonus}
              </span>
            )} */}
            {isLoading ? (
              "??"
            ) : (
              // <span className={`text-${journalColors.day}`}>
              //   {totalWillpower.generated}
              // </span>
              <span>{totalWillpower.generated + totalWillpower.bonus}</span>
            )}
            <FaBoltLightning className="ml-1 text-2xl" />
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
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="w-full grid grid-cols-7 gap-2 px-2">
            {willpowerData.map(
              ({ generatedWillpower, bonusWillpower }, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-2"
                    aria-label={`Day ${index + 1} willpower`}
                  >
                    {generatedWillpower === 0 && bonusWillpower === 0 ? (
                      <></>
                    ) : (
                      <div className="text-center font-semibold text-xs">
                        <span className={`text-${journalColors.night}`}>
                          +{bonusWillpower}
                        </span>
                        <span className="font-thin">/</span>
                        <span className={`text-${journalColors.day}`}>
                          {generatedWillpower}
                        </span>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
