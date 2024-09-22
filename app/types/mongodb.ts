import { ObjectId } from "mongodb";

// HABITS =============================================================================

export type Habit = {
  _id?: ObjectId;
  name: string;
  icon: string;
  description: string;
  xp: number;
  creatorId: ObjectId;
};

export type NewHabit = Omit<Habit, "_id">; // Lets mongo db assign the _id

export type HabitUpdate = [string, number]; // [habitId, xpChange]

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

export type JournalEntryUpdate = []; // [habitId, xpChange]
