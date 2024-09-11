import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import Habit from "@models/habit";

export const POST = async (req: NextRequest) => {
  const { userId, name, icon, description } = await req.json();

  try {
    await connectToDB();
    const newHabit = new Habit({
      creator: userId,
      name,
      icon,
      description,
    });

    await newHabit.save();

    return new NextResponse(JSON.stringify(newHabit), { status: 201 });
  } catch (error: any) {
    console.error("Error in /api/habit/new:", error);
    return new NextResponse(`Failed to create new habit: ${error.message}`, {
      status: 500,
    });
    // return new NextResponse("Failed to create new habit", { status: 500 });
  }
};
