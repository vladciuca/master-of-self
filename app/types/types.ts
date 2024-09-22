import { ReactNode } from "react";
import { Session as NextAuthSession, User as NextAuthUser } from "next-auth";

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
};
export type UserMetadata = User & UserSettings;

export interface Session extends NextAuthSession {
  user: User;
}

export type JournalEntry = {
  dailyWillpower: number;
  bonusWillpower: number;
  dayEntry?: {
    greatToday?: string[];
    gratefulFor?: string[];
  };
  nightEntry?: {
    dailyHighlights?: string[];
    learnedToday?: string;
    habits?: { [key: string]: number };
  };
};

export type JournalEntryMetadata = JournalEntry & {
  _id: string;
  createDate: Date;
  creator: {
    _id: string;
  };
};

export type Habit = {
  _id: string;
  name: string;
  icon: string;
  description: string;
  xp: number;
  creator: {
    _id: string;
  };
};
