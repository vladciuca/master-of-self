import React from "react";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import {
  GiPrayer,
  GiBackup,
  // GiPlayerTime, // might be used for REFLECTION STEP in JOURNAL-REFACTOR
  GiAura,
  GiPencilRuler,
  GiEnlightenment,
  GiHazardSign,
} from "react-icons/gi";
// import colors from "../../lib/colors";
import { JOURNAL_COLORS, HABIT_COLORS } from "@lib/colors";

//JOURNAL STEP ICONS
export type StepIconMap = {
  [key: string]: React.ReactNode;
};

export const stepIconMap: StepIconMap = {
  day: <FaSun size={"1.3rem"} />,
  night: <FaMoon size={"1.4rem"} />,
  affirmations: <GiAura size={"1.9rem"} className="mb-1" />,
  highlights: <FaStar size={"1.4rem"} />,
  gratitude: <GiPrayer size={"1.4rem"} />,
  reflection: <GiBackup size={"1.4rem"} />,
  habits: <GiPencilRuler size={"1.4rem"} />,
  bonus: <GiEnlightenment size={"1.7rem"} />,
  default: <GiHazardSign size={"1.4rem"} />,
};

// NOTE: very specific function that removes the conflicting mb- tailwind classes
// Used in journal entry card - disciplines
/**
 * Merges icon props while preserving original styles
 * @param icon The original icon element
 * @param newProps New props to apply
 * @returns A new React element with merged props
 */
export function mergeIconProps(
  icon: React.ReactElement,
  newProps: Record<string, any>
): React.ReactElement {
  // Get the original props
  const originalProps = icon.props;

  // For className, we need to handle Tailwind conflicts
  let className = "";

  if (newProps.className && originalProps.className) {
    // Extract utility classes that might conflict
    const originalClasses = originalProps.className.split(" ");
    const newClasses = newProps.className.split(" ");

    // Find utility prefixes that exist in both sets (like 'mb-')
    const conflictPrefixes = new Set();

    // Identify potential conflicts by checking utility prefixes
    originalClasses.forEach((cls: string) => {
      const match = cls.match(/^([a-z]+-)/);
      if (match) {
        const prefix = match[1];
        newClasses.forEach((newCls: string) => {
          if (newCls.startsWith(prefix)) {
            conflictPrefixes.add(prefix);
          }
        });
      }
    });

    // Filter out original classes that have conflicting prefixes
    const filteredOriginalClasses = originalClasses.filter((cls: string) => {
      const match = cls.match(/^([a-z]+-)/);
      return !(match && conflictPrefixes.has(match[1]));
    });

    // Combine filtered original classes with all new classes
    className = [...filteredOriginalClasses, ...newClasses].join(" ");
  } else {
    className = newProps.className || originalProps.className;
  }

  // Create merged props object, prioritizing original props for size and other attributes
  const mergedProps = {
    ...originalProps,
    ...newProps,
    // Override with explicit merges
    className,
    size: newProps.size || originalProps.size,
  };

  return React.cloneElement(icon, mergedProps);
}

export type StepDisciplines = {
  [key: string]: string;
};

export const stepDisciplines: StepDisciplines = {
  gratitude: "Positivity",
  day: "Motivation",
  affirmations: "Confidence",
  highlights: "Awareness",
  reflection: "Resilience",
};

//JOURNAL STEPS STYLE
export type StepStyle = {
  bgColor: string;
};

export const stepStyles: { [key: string]: StepStyle } = {
  // CONDITIONAL STEP: active if Night entries form yesterday's journal exist
  // NOTE* This fallback is for the bonus step
  default: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  bonus: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  gratitude: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  affirmations: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  day: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  // DAY STEP
  // Affirmations Step: +confidence points
  // NOTE* Will be implemented in JOURNAL-REFACTOR
  // affirmations: {
  //   bgColor: `bg-${JOURNAL_COLORS.day}`,
  // },
  night: {
    bgColor: "bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]",
    // bgColor: `bg-[linear-gradient(to_right,_${JOURNAL_COLORS.dayHex}_50%,_${JOURNAL_COLORS.nightHex}_50%)]`,
    // TO RETARDED TO INTEGRATE THIS AND I do not want to create a Tailwind theme extension for this that it might even be removed
    // tailwind.config.js
    // const colors = require("./lib/colors");

    // module.exports = {
    //   // ... other config
    //   safelist: [
    //     // ... other patterns
    //     {
    //       pattern: /^bg-\[.*\]$/,
    //       variants: ['hover', 'focus', 'active'],
    //     }
    //   ],
    //   theme: {
    //     extend: {
    //       backgroundImage: {
    //         'night-gradient': `linear-gradient(to right, ${colors.JOURNAL_COLORS.dayHex} 50%, ${colors.JOURNAL_COLORS.nightHex} 50%)`,
    //       },
    //     },
    //   },
    //   // ... other config
    // };
  },
  highlights: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
  reflection: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
  habits: {
    bgColor: `bg-${HABIT_COLORS.main}`,
  },
};

export const getStepStyle = (stepType: string): StepStyle => {
  return stepStyles[stepType] || stepStyles.default;
};

//HABIT ICONS
