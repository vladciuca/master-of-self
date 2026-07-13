import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createHabit } from "@lib/mongo/habits";
import { HabitAction } from "@models/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, icon, actions }: { name: string; icon: string; actions: HabitAction[] } =
      await req.json();

    const { newHabit, error } = await createHabit(userId, name, icon, actions);

    if (error) {
      return new NextResponse(error, { status: 500 });
    }

    return new NextResponse(JSON.stringify(newHabit), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Failed to create new habit: ${message}`, {
      status: 500,
    });
  }
}
