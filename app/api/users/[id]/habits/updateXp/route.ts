import { NextRequest, NextResponse } from "next/server";
import { updateHabitsXp } from "@lib/mongo/habits";
import { HabitUpdate } from "@app/types/mongodb";

export async function PATCH(req: NextRequest) {
  const habitUpdates: HabitUpdate[] = await req.json();

  try {
    const { updatedHabits, error } = await updateHabitsXp(habitUpdates);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ habits: updatedHabits }, { status: 200 });
  } catch (error) {
    console.error("Error updating habit XP:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
