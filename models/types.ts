import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { XpData, Practice } from "./mongodb";

export type Layout = {
  children: ReactNode;
};

export interface User {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
}

export type UserDisciplines = {
  [key: string]: number;
};

export type UserPractices = {
  [key: string]: number;
};

export type UserProfile = {
  willpowerMultiplier: number;
  disciplines: UserDisciplines;
  practices: UserPractices;
  activePractices: string[];
  practiceOrder?: string[];
  journalStartTime: {
    morning: string;
    evening: string;
  };
  onboardingCompleted: boolean;
};

export type UserMetadata = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  profile: UserProfile;
};

// JOURNAL STEP -----------------------------------------------------
export type JournalStepType = "dayEntry" | "nightEntry" | "other";

export type JournalStepData = {
  discipline: string;
  type: JournalStepType;
};

export type JournalStepMetadata = {
  _id?: string | ObjectId;
  creatorId?: string | ObjectId;
  icon: string;
  color?: string;
};

export type JournalStepContent = {
  title: string;
  description: string;
};

export type JournalStep = JournalStepData & JournalStepContent;

export type JournalCustomStepConfig = JournalStep & JournalStepMetadata;

export type JournalCustomStep = JournalStepMetadata &
  JournalStepData & {
    component: JSX.Element;
    isAvailable?: boolean; //this gets added when the Form Steps are built

    // discipline: string;
    // type: JournalStepType; // from JournalStepData

    // _id: string;
    // icon: string; // from JournalStepMetadata
  };

// PRACTICE OVERVIEW ---------------------------------------------------

export type PracticePageItem = Practice | JournalCustomStepConfig;

export type PracticePageSection = {
  title: string;
  icon?: string;
  pages: PracticePageItem[];
};

// JOURNAL TYPES -----------------------------------------------------

export type JournalEntryHabitActions = {
  [key: string]: number;
};

export type JournalEntryHabit = {
  [key: string]: JournalEntryHabitActions & { currentXp?: number };
};

export type JournalDayEntry = {
  day?: string[];
  repeat?: string[];
  [key: string]: string[] | undefined;
};

export type JournalNightEntry = {
  night?: string[];
  // highlights: string[];
  [key: string]: string[] | undefined;
};

export type JournalEntry = {
  dailyWillpower: number;
  bonusWillpower: number;
  dayEntry?: JournalDayEntry;
  nightEntry?: JournalNightEntry;
  habits: JournalEntryHabit;
};

export type JournalEntryMetadata = JournalEntry & {
  _id: string;
  createDate: Date;
  creatorId: string;
};

// HABIT TYPES ------------------------------------------------------

export type HabitAction = {
  id: string;
  task: string;
  unit: string;
  metric: "count" | "time";
  type: "build" | "break";
  value: number;
  dailyTarget: number;
  // actionData key - used for chart
  // actionData: [Date, string | number][];
};

export type Habit = {
  _id: string;
  name: string;
  icon: string;
  xp: number;
  xpData: XpData[];
  creatorId: string;
  actions: HabitAction[];
};

export type WeeklyWillpowerData = {
  date: string;
  generatedWillpower: number;
  bonusWillpower: number;
};
