import { ReactNode } from "react";
import { Session as NextAuthSession, User as NextAuthUser } from "next-auth";
import { XpData } from "./mongodb";

export type Layout = {
  children: ReactNode;
};

export interface User extends NextAuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export type UserJournalSteps = {
  gratitude: boolean;
  affirmations: boolean;
  reflection: boolean;
};

export type UserDisciplines = {
  positivity?: number;
  motivation?: number;
  confidence?: number;
  awareness?: number;
  resilience?: number;
  // [key:string]: number;
};

export type UserSettings = {
  steps: UserJournalSteps;
  //get out into user object
  disciplines: UserDisciplines;
  journalStartTime: {
    morning: string;
    evening: string;
  };
};
export type UserMetadata = User & UserSettings;

export interface Session extends NextAuthSession {
  user: User;
}

// PROFILE TYPES -----------------------------------------------------

//NOTE: WILL NEED REFACTOR since there are no more stepkeys
export type RoutineStepProps = {
  icon?: React.ReactElement;
  title: string;
  description: string;
  stepKey: "gratitude" | "affirmations" | "reflection";
};

// JOURNAL STEP -----------------------------------------------------
//Note: Rename these to StepType = "dayEntry" | "nightEntry"
export type JournalCategory = "day" | "night" | "other";

export type JournalStep = {
  //rename the type to discipline
  type: string;
  //rename category to type
  category: JournalCategory;
  title: string;
  description: string;
};

export type JournalStepConfig = JournalStep & {
  icon: ReactNode;
  isAvailable: boolean;
};

export type JournalEntryCustomStep = {
  icon: ReactNode;
  type: string;
  component: JSX.Element;
  category: JournalCategory;
  isAvailable?: boolean;
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
  // gratitude?: string[];
  // affirmations?: string[];
  [key: string]: string[] | undefined;
};

export type JournalNightEntry = {
  night?: string[];
  // highlights?: string[];
  // reflection?: string[];
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
