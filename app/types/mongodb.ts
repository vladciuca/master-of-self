import { ObjectId } from "mongodb";

export type Habit = {
  _id?: ObjectId;
  name: string;
  icon: string;
  description: string;
  xp: number;
  creator: {
    _id: ObjectId;
  };
};

export type NewHabit = Omit<Habit, "_id">; // Lets mongo db assign the _id

export type HabitUpdate = [string, number]; // [habitId, xpChange]
