import { JOURNAL_COLORS, HABIT_COLORS } from "@lib/colors";

export type StepIconMap = {
  [key: string]: string;
};

export const stepIconMap: StepIconMap = {
  //Built-in step icons
  day: "FaSun",
  night: "FaMoon",
  sleep: "GiNightSleep",
  habits: "GiPencilRuler",
  //Custom step icons
  confidence: "GiAura",
  awareness: "GiAwareness",
  positivity: "GiHealing",
  resilience: "GiGuardedTower",
  highlights: "FaStar",
  overview: "GiPencilRuler",
  // willpower: "IoAccessibility",
  bonus: "FaBoltLightning",
  default: "GiInnerSelf",
};

//JOURNAL STEPS STYLE
export type StepStyle = {
  bgColor: string;
};

export const journalStepStyle: { [key: string]: StepStyle } = {
  default: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  bonus: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  day: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  night: {
    bgColor: "bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]",
  },
  highlights: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
  habits: {
    bgColor: `bg-${HABIT_COLORS.main}`,
  },
  dayEntry: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  nightEntry: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
};

export const getJournalStepStyle = (stepType: string): StepStyle => {
  return journalStepStyle[stepType] || journalStepStyle.default;
};

export function getTimePeriodIconAndColor(
  timePeriod: "day" | "night" | "sleep"
) {
  switch (timePeriod) {
    case "day":
      return {
        periodColor: JOURNAL_COLORS.day,
        iconName: stepIconMap.day,
      };
    case "night":
      return {
        periodColor: JOURNAL_COLORS.night,
        iconName: stepIconMap.night,
      };
    default: // 'sleep'
      return {
        periodColor: JOURNAL_COLORS.sleep,
        iconName: stepIconMap.sleep,
      };
  }
}

export const DISCIPLINE_ICONS = [
  "GiAnatomy",
  "GiAwareness",
  "GiAura",
  "GiBackup",
  "GiBandaged",
  "GiBeamsAura",
  "GiBellShield",
  "GiBodyHeight",
  "GiBodySwapping",
  "GiBurningPassion",
  "GiCementShoes",
  "GiDeadlyStrike",
  "GiDecapitation",
  "GiDuality",
  "GiEskimo",
  "GiExtraLucid",
  "GiFrozenBody",
  "GiHealing",
  "GiIciclesAura",
  "GiInnerSelf",
  "GiLovers",
  "GiMasterOfArms",
  "GiMeditation",
  "GiPlayerBase",
  "GiPlayerNext",
  "GiPlayerPrevious",
  "GiPlayerTime",
  "GiPsychicWaves",
  "GiRearAura",
  "GiRomanToga",
  "GiSkills",
  "GiSmart",
  "GiSpikedArmor",
  "GiSurroundedShield",
  "GiTeamIdea",
  "GiTeamDowngrade",
  "GiTeamUpgrade",
  "GiTelepathy",
  "GiTeleport",
  "GiTwoShadows",
  "GiGuardedTower",
  "GiSwordTie",
  "GiSpikedWall",
  "GiParanoia",
  "GiPiercedBody",
  "GiHeartInside",
  "GiQuicksand",
  "GiIfrit",
];
