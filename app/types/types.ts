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

export type UserSettings = {
  steps: {
    gratefulStep: boolean;
    reflectionStep: boolean;
  };
  journalStartTime: {
    morning: string;
    evening: string;
  };
  // TODO - for V2
  // userXp: number;
  // habitSlots: number;
  // goalSlots: number;
};
export type UserMetadata = User & UserSettings;

export interface Session extends NextAuthSession {
  user: User;
}

export type ActionItem = {
  [key: string]: number;
};

export type Actions = {
  [key: string]: ActionItem & { currentXp: number };
};

export type JournalEntry = {
  dailyWillpower: number;
  bonusWillpower: number;
  dayEntry?: {
    greatToday?: string[];
    gratefulFor?: string[];
  };
  nightEntry?: {
    howGreatToday?: string[];
    dailyHighlights?: string[];
    learnedToday?: string[];
    //obsolete key habits - moved into actions key
    habits?: { [key: string]: number };
    actions?: Actions;
  };
};

export type JournalEntryMetadata = JournalEntry & {
  _id: string;
  createDate: Date;
  creatorId: string;
};

export type HabitAction = {
  id: string;
  action: string;
  actionUnit: string;
  metric: "count" | "time";
  type: "offensive" | "defensive";
  value: number;
  dailyTarget: number;
  // actionData: [Date, string | number][];
};

export type Habit = {
  _id: string;
  name: string;
  icon: string;
  description: string;
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
