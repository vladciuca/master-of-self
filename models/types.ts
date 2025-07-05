import { ObjectId } from "mongodb";
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

export type UserDisciplines = {
  [key: string]: number;
};

export type UserProfile = {
  willpowerMultiplier: number;
  disciplines: UserDisciplines;
  //NOTE: active discipline ID list
  activeDisciplines: string[];
  journalStartTime: {
    morning: string;
    evening: string;
  };
  onboardingCompleted: boolean;
};

export type UserMetadata = User & {
  profile: UserProfile;
};

export interface Session extends NextAuthSession {
  user: User;
}

// JOURNEY ROADMAP -----------------------------------------------------
export type Task = string;

export type Objective = {
  title: string; // e.g., "Launch your personal website"
  tasks: Task[]; // Specific action points under this objective
};

export type Milestone = {
  number: number; // e.g., 1, 2, 3...
  title: string; // e.g., "Milestone 1: Foundation Setup"
  focus: string; // High-level focus for this milestone
  timeframe: string; // e.g., "Month 1-2" or "Week 5"
  objectives: Objective[]; // Specific goals under this milestone
};

export type RoadmapData = {
  title: string; // e.g., "6-Month Roadmap to Launch a Podcast"
  description: string; // Encouraging summary of the journey
  totalMilestones: number; // This directly maps to the number of Milestone objects
  timeUnit: "weeks" | "months"; // Determines time granularity
  totalDuration: number; // Total weeks/months in the full plan
  milestones: Milestone[]; // Array of major milestones
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

// JOURNAL TYPES -----------------------------------------------------

export type JournalEntryHabitActions = {
  [key: string]: number;
};

export type JournalEntryHabit = {
  [key: string]: JournalEntryHabitActions & { currentXp?: number };
};

export type JournalDayEntry = {
  day?: string[];
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
