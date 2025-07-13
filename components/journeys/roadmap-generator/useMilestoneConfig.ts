import { useState, useEffect } from "react";

export interface MilestoneConfig {
  min: number;
  max: number;
  step: number;
  default: number;
}

export function useMilestoneConfig(selectedPeriod: string) {
  const [numberOfMajorMilestones, setNumberOfMajorMilestones] =
    useState<number>(3);

  const getMilestoneSliderProps = (): MilestoneConfig => {
    switch (selectedPeriod) {
      case "1m": // 1 month = 4 weeks total
        return { min: 2, max: 4, step: 1, default: 3 }; // 2, 3, 4 milestones only, default to middle (3)
      case "3m": // 3 months total
        return { min: 2, max: 6, step: 1, default: 4 }; // 2-6 milestones, default to middle (4)
      case "6m": // 6 months total
        return { min: 3, max: 9, step: 1, default: 6 }; // 3-9 milestones, default to middle (6)
      case "12m": // 12 months total
        return { min: 4, max: 12, step: 1, default: 8 }; // 4-12 milestones, default to middle (8)
      default:
        return { min: 2, max: 4, step: 1, default: 3 }; // Fallback
    }
  };

  useEffect(() => {
    const { default: defaultMilestones } = getMilestoneSliderProps();
    setNumberOfMajorMilestones(defaultMilestones);
  }, [selectedPeriod]);

  return {
    numberOfMajorMilestones,
    setNumberOfMajorMilestones,
    milestoneConfig: getMilestoneSliderProps(),
  };
}
