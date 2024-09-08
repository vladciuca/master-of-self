// app/api/habits/icons/route.ts
// can be changed to something more relevant
// but right now habits is under user/[id] and I do not want to add that extra condition(user id) to the call
// or do we?

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import Habit from "@models/habit";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const ids = url.searchParams.get("ids");

  if (!ids) {
    return new NextResponse("No habit IDs provided", { status: 400 });
  }

  try {
    await connectToDB();

    const habitIds = ids.split(",");
    const habits = await Habit.find({ _id: { $in: habitIds } }).select(
      "_id icon"
    );

    const iconMap = habits.reduce((acc, habit) => {
      acc[habit._id.toString()] = habit.icon;
      return acc;
    }, {} as Record<string, string>);

    return new NextResponse(JSON.stringify(iconMap), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch habit icons:", error);
    return new NextResponse("Failed to fetch habit icons", { status: 500 });
  }
}
