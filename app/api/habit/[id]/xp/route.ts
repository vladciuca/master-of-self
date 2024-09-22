// currently not in Use, opted for updating multiple habits at once @user/[id]/habits/updateXp
// might use for something else later
import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@lib/mongoose";
import Habit from "@models/habit";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { xp: newXpValue } = await req.json();

  try {
    // await connectToDB();

    const habit = await Habit.findById(params.id);

    if (!habit) {
      return new Response("Habit not found", { status: 404 });
    }

    const updatedXpValue = habit.xp + newXpValue;

    const updatedHabitXp = await Habit.findByIdAndUpdate(
      params.id,
      { $set: { xp: updatedXpValue } },
      { new: true }
    );

    return new Response(JSON.stringify(updatedHabitXp), { status: 200 });
  } catch (error) {
    return new Response("Failed to update habit xp", { status: 500 });
  }
};
