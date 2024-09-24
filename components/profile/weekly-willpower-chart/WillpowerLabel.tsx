import { useEffect, useState, useRef } from "react";
import { WillpowerChartBaseProps } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { LabelProps } from "recharts";

type WillpowerLabelProps = LabelProps & WillpowerChartBaseProps;

export function WillpowerLabel(props: WillpowerLabelProps) {
  const { x = 0, y = 0, width = 0, value } = props;
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

  const labelY = Math.max(y - 10, fontSize);

  return (
    <g transform={`translate(${x + width / 2 - totalWidth / 2}, ${labelY})`}>
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
