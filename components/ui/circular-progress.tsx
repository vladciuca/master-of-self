import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { XP_HEX_COLORS } from "@lib/colors";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // Between 1 and 100
  xpGainValue?: number;
  strokeWidth: number;
  circleSize: number;
  projectedXp: number;
}

export function CircularProgress({
  value,
  xpGainValue,
  strokeWidth,
  circleSize,
  projectedXp = 0,
  ...divProps
}: CircularProgressProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(circleSize);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize(Math.min(width, height));
    }
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute offsets
  const percentage = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  const gainPercentage = Math.min(Math.max(xpGainValue ?? 0, 0), 100);
  const gainOffset = circumference - (gainPercentage / 100) * circumference;

  // Derived state for readability
  const isPositiveXp = projectedXp >= 0;
  const isNegativeXp = projectedXp < 0;

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

          {/* Static circle */}
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

          {/* Positive XP Gain circle */}
          {isPositiveXp && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={XP_HEX_COLORS.positiveHex}
              strokeWidth={strokeWidth}
              fill="none"
              // className="stroke-lime-500"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: gainOffset,
                strokeLinecap: "round",
              }}
            />
          )}

          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeLinecap="round"
            className="fill-none"
            strokeWidth={strokeWidth}
            stroke={
              isNegativeXp ? XP_HEX_COLORS.negativeHex : "url(#circle-progress)"
            }
            animate={{
              strokeDashoffset: offset,
            }}
            initial={{
              strokeDashoffset: circumference,
              strokeDasharray: circumference,
            }}
            transition={{ ease: "easeOut" }}
          />

          {/* Negative XP Gain circle */}
          {isNegativeXp && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              style={{
                stroke: "currentColor", // Inherits theme color dynamically
                strokeDasharray: circumference,
                strokeDashoffset: gainOffset,
                strokeLinecap: "round",
              }}
            />
          )}
        </svg>
      )}
    </div>
  );
}
