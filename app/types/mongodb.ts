import { ObjectId } from "mongodb";
import { UserSettings } from "./types";

// USER ===============================================================================

export type User = {
  _id?: ObjectId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  settings: UserSettings;
};

export type NewUser = Omit<User, "_id">; // Lets MongoDB assign the _id

// JOURNAL ENTRIES ====================================================================

export type JournalEntry = {
  _id?: ObjectId;
  creatorId: ObjectId;
  createDate: Date;
  dailyWillpower: Number;
  bonusWillpower: Number;
  dayEntry: Object;
  nightEntry: Object;
};

export type NewJournalEntry = Omit<JournalEntry, "_id">; // Lets mongo db assign the _id

// HABITS =============================================================================

export type Action = {
  id: string;
  action: string;
  metric: "count" | "time";
  type: "offensive" | "defensive";
  value: number;
};

export type Habit = {
  _id?: ObjectId;
  name: string;
  icon: string;
  description: string;
  xp: number;
  xpData: XpData[];
  creatorId: ObjectId;
  actions: Action[];
};

export type NewHabit = Omit<Habit, "_id">; // Lets mongo db assign the _id

export type HabitUpdate = [string, number]; // [habitId, xpChange]

export type XpData = [string, number]; // [date, xp]

export type HabitActionUpdate = {
  [habitId: string]: {
    [actionId: string]: number;
  };
};
