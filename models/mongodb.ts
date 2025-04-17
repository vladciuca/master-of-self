import { ObjectId } from "mongodb";
import {
  UserProfile,
  JournalEntryHabit,
  JournalCustomStepConfig,
} from "./types";

// USER ===============================================================================

export type User = {
  _id?: ObjectId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  profile: UserProfile;
};

// export type NewUser = Omit<User, "_id">; // Lets MongoDB assign the _id

// JOURNAL ENTRIES ====================================================================

export type JournalEntry = {
  _id?: ObjectId;
  creatorId: ObjectId;
  createDate: Date;
  dailyWillpower: Number;
  bonusWillpower: Number;
  dayEntry: Object;
  nightEntry: Object;
  habits: JournalEntryHabit;
};

export type NewJournalEntry = Omit<JournalEntry, "_id">; // Lets mongo db assign the _id

// DISCIPLINE STEPS ===================================================================

export type Discipline = Omit<JournalCustomStepConfig, "_id"> & {
  _id?: ObjectId;
  creatorId: ObjectId;
  color: string;
};

export type NewDiscipline = Omit<Discipline, "_id">;

// HABITS =============================================================================

export type HabitAction = {
  id: string;
  task: string;
  unit: string;
  metric: "count" | "time";
  type: "build" | "break";
  value: number;
};

export type Habit = {
  _id?: ObjectId;
  name: string;
  icon: string;
  xp: number;
  xpData: XpData[];
  creatorId: ObjectId;
  actions: HabitAction[];
};

export type NewHabit = Omit<Habit, "_id">; // Lets mongo db assign the _id

export type HabitUpdate = [string, number]; // [habitId, xpChange]

export type XpData = [string, number]; // [date, xp]

export type HabitActionUpdate = {
  [habitId: string]: {
    [actionId: string]: number;
  };
};
