import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // Something between 1 and 100
  xpGainValue?: number;
  strokeWidth: number;
  circleSize: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  xpGainValue,
  strokeWidth,
  circleSize,
  ...divProps
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(circleSize);

  useEffect(() => {
    if (
      containerRef.current &&
      "getBoundingClientRect" in containerRef.current
    ) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize(Math.min(width, height));
    }
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculations for the primary circle
  const percentage = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  // Calculations for the green circle
  const gainPercentage = Math.min(Math.max(xpGainValue ?? 0, 0), 100);
  const gainCircumference = circumference; // The gain circle uses the same radius as the main circle
  const gainOffset =
    gainCircumference - (gainPercentage / 100) * gainCircumference;

  return (
    <div
      ref={containerRef}
      {...divProps}
      className="flex items-center justify-center"
    >
      {size > 0 && (
        <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient
              id="circle-progress"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(53.1659 -18.1884) rotate(51.1683) scale(267.012 282.957)"
            >
              <stop stopColor="currentColor" />
              <stop offset="1" stopColor="currentColor" />
            </radialGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className="stroke-secondary"
          />
          {/* The static circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeLinecap="round"
            className="fill-none"
            style={{
              strokeWidth,
              strokeDasharray: circumference,
              strokeDashoffset: circumference,
            }}
          />
          {/* New green circle */}
          {xpGainValue !== undefined && xpGainValue > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="green"
              strokeWidth={strokeWidth}
              fill="none"
              className="stroke-green-500"
              style={{
                strokeDasharray: gainCircumference,
                strokeDashoffset: gainOffset,
                strokeLinecap: "round",
              }}
            />
          )}
          {/* The animated circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeLinecap="round"
            className="fill-none"
            style={{ stroke: "url(#circle-progress)", strokeWidth }}
            initial={{
              strokeDashoffset: circumference,
              strokeDasharray: circumference,
            }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              ease: "easeOut",
            }}
          />
        </svg>
      )}
    </div>
  );
};

export default CircularProgress;