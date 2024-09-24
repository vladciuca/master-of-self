import { WillpowerChartBaseProps } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { Rectangle, RectangleProps } from "recharts";
import { WeeklyWillpowerData } from "@app/types/types";

type WillpowerBarProps = RectangleProps &
  WillpowerChartBaseProps & {
    type: "bonus" | "generated";
    payload?: WeeklyWillpowerData;
  };

export function WillpowerBar(props: WillpowerBarProps) {
  const { payload, type, height, y, ...rest } = props;
  const adjustedY = y ? y + (height ? height * 0.2 : 0) : 0; // Move the bar down by 20% of the height
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

  const adjustedHeight: number = (() => {
    if (typeof height !== "number") {
      return 0; // Handle the case where height is undefined
    }
    if (type === "generated") {
      return height * 0.8;
    }
    return height;
  })();

  return (
    <Rectangle
      {...rest}
      y={adjustedY}
      height={adjustedHeight}
      radius={radius}
    />
  );
}
