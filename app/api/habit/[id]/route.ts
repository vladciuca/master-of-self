import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@lib/mongoose";
import Habit from "@models/habit";
import { getHabit, updateHabit, deleteHabit } from "@lib/mongo/habits";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { habit, error } = await getHabit(params.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!habit) return new NextResponse("Habit not found", { status: 404 });

    return new NextResponse(JSON.stringify(habit), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch habit", { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { name, icon, description } = await req.json();

  try {
    // await connectToDB();

    // const updatedHabit = await Habit.findByIdAndUpdate(
    //   params.id,
    //   { $set: { name: name, icon: icon, description: description } },
    //   { new: true }
    // );

    const { habit, error } = await updateHabit(
      params.id,
      name,
      icon,
      description
    );

    // if (!updatedHabit) {
    //   return new NextResponse("Habit not found", { status: 404 });
    // }

    // return new NextResponse(JSON.stringify(updatedHabit), { status: 200 });
    if (error) {
      return new NextResponse(error, { status: 404 });
    }

    return new NextResponse(JSON.stringify(habit), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to update habit", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { success, error } = await deleteHabit(params.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to delete habit", { status: 500 });
  }
};
