import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@lib/database";
import Habit from "@models/habit";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const habits = await Habit.find({}).populate("creator");

    return new NextResponse(JSON.stringify(habits), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch all habits", { status: 500 });
  }
};
