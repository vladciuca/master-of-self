import { ObjectId } from "mongodb";

export type Habit = {
  _id: ObjectId;
  name: string;
  icon: string;
  description: string;
  xp: number;
  creator: {
    _id: ObjectId;
  };
  // userId: string; // Add this if you're associating habits with users - maybe replace creator with this
};

export type HabitUpdate = [string, number]; // [habitId, xpChange]
