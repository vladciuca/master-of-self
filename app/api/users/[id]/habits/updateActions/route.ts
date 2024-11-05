import { NextRequest, NextResponse } from "next/server";
import { updateHabitsActions } from "@/lib/mongo/habits";

export async function PATCH(req: NextRequest) {
  const { userId, habitActionUpdates, updateDate } = await req.json();

  try {
    const { updatedHabits, error } = await updateHabitsActions(
      userId,
      habitActionUpdates,
      updateDate
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ habits: updatedHabits }, { status: 200 });
  } catch (error) {
    console.error("Error updating habit actions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
