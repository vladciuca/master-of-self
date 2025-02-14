import { WillpowerChartBaseProps } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { Rectangle, RectangleProps } from "recharts";
import { WeeklyWillpowerData } from "@models/types";

type WillpowerBarProps = RectangleProps &
  WillpowerChartBaseProps & {
    type: "bonus" | "generated";
    payload?: WeeklyWillpowerData;
  };

export function WillpowerBar(props: WillpowerBarProps) {
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
