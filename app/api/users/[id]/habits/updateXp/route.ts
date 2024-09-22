// import { NextRequest, NextResponse } from "next/server";
// // import { connectToDB } from "@lib/mongoose";
// import Habit from "@models/habit";

// export const PATCH = async (req: NextRequest) => {
//   const habitUpdates: [string, number][] = await req.json();

//   try {
//     // await connectToDB();

//     const updatePromises = habitUpdates.map(async ([id, xp]) => {
//       const habit = await Habit.findById(id);
//       if (!habit) {
//         throw new Error(`Habit not found: ${id}`);
//       }

//       const updatedXpValue = habit.xp + xp;
//       return Habit.findByIdAndUpdate(
//         id,
//         { $set: { xp: updatedXpValue } },
//         { new: true }
//       );
//     });

//     const updatedHabits = await Promise.all(updatePromises);

//     return new Response(JSON.stringify(updatedHabits), { status: 200 });
//   } catch (error) {
//     return new Response("Failed to update habit xp", { status: 500 });
//   }
// };

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
