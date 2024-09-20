import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@lib/database";
import Habit from "@models/habit";

export const PATCH = async (req: NextRequest) => {
  const habitUpdates: [string, number][] = await req.json();

  try {
    await connectToDB();

    const updatePromises = habitUpdates.map(async ([id, xp]) => {
      const habit = await Habit.findById(id);
      if (!habit) {
        throw new Error(`Habit not found: ${id}`);
      }

      const updatedXpValue = habit.xp + xp;
      return Habit.findByIdAndUpdate(
        id,
        { $set: { xp: updatedXpValue } },
        { new: true }
      );
    });

    const updatedHabits = await Promise.all(updatePromises);

    return new Response(JSON.stringify(updatedHabits), { status: 200 });
  } catch (error) {
    return new Response("Failed to update habit xp", { status: 500 });
  }
};
