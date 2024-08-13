import { connectToDB } from "@utils/database";
import Habit from "@models/habit";
import { NextRequest } from "next/server";

//GET (read)

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const habit = await Habit.findById(params.id).populate("creator");

    if (!habit) return new Response("Habit not found", { status: 404 });

    return new Response(JSON.stringify(habit), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch habit", { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { name, icon, description } = await req.json();

  try {
    await connectToDB();

    const updatedHabit = await Habit.findByIdAndUpdate(
      params.id,
      { $set: { name: name, icon: icon, description: description } },
      { new: true }
    );

    if (!updatedHabit) {
      return new Response("Habit not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedHabit), { status: 200 });
  } catch (error) {
    return new Response("Failed to update habit", { status: 500 });
  }
};

//DELETE (delete)

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    await Habit.findByIdAndDelete(params.id);

    return new Response("Habit was deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to delete habit", { status: 500 });
  }
};
