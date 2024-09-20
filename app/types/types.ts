import { ReactNode } from "react";
import { Session as NextAuthSession } from "next-auth";

export type Layout = {
  children: ReactNode;
};

export type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
};

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

export type Session = NextAuthSession & {
  user: User;
};

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
