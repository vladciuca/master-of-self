import { NextRequest, NextResponse } from "next/server";
import { createHabit } from "@lib/mongo/habits";

export const POST = async (req: NextRequest) => {
  const { userId, name, icon, description } = await req.json();

  try {
    const { newHabit, error } = await createHabit(
      userId,
      name,
      icon,
      description
    );

    if (error) {
      return new NextResponse(error, { status: 500 });
    }

    return new NextResponse(JSON.stringify(newHabit), { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Failed to create new habit: ${error.message}`, {
      status: 500,
    });
  }
};
