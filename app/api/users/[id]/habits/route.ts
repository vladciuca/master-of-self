import { NextRequest } from "next/server";
import { connectToDB } from "@lib/database";
import Habit from "@models/habit";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const habits = await Habit.find({
      creator: params.id,
    }).populate("creator");

    return new Response(JSON.stringify(habits), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all habits", { status: 500 });
  }
};
