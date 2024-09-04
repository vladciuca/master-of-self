// import { connectToDB } from "@utils/database";
// import Habit from "@models/habit";

// export const PATCH = async (req, { params }) => {
//   const { resource: newResourceValue } = await req.json();

//   try {
//     await connectToDB();

//     const habit = await Habit.findById(params.id);

//     if (!habit) {
//       return new Response("Habit not found", { status: 404 });
//     }

//     const updatedResourceValue = habit.resource + newResourceValue;

//     const updatedHabitResource = await Habit.findByIdAndUpdate(
//       params.id,
//       { $set: { resource: updatedResourceValue } },
//       { new: true }
//     );

//     if (!updatedHabit) {
//       return new Response("Habit not found", { status: 404 });
//     }

//     return new Response(JSON.stringify(updatedHabitResource), { status: 200 });
//   } catch (error) {
//     return new Response("Failed to update habit resource", { status: 500 });
//   }
// };

// export const GET = async (req, { params }) => {
//   try {
//     await connectToDB();

//     const journalEntries = await JournalEntry.find({
//       creator: params.id,
//     }).populate("creator");

//     return new Response(JSON.stringify(journalEntries), { status: 200 });
//   } catch (error) {
//     return new Response("Failed to fetch all habits", { status: 500 });
//   }
// };
