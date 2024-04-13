import { connectToDB } from "@utils/database";
import Habit from "@models/habit";

//GET (read)

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const habit = await Habit.findById(params.id).populate("creator");

    if (!habit) return new Response("Habit not found", { status: 404 });

    return new Response(JSON.stringify(habit), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch habit", { status: 500 });
  }
};

//PATCH (update)

// export const PATCH = async (req, { params }) => {
//   const { name, description, category } = await req.json();

//   try {
//     await connectToDB();

//     const existingHabit = await Habit.findById(params.id);

//     if (!existingHabit) return new Response("Habit not found", { status: 404 });

//     existingHabit.name = name;
//     existingHabit.description = description;
//     existingHabit.category = category;

//     await existingHabit.save();

//     return new Response(JSON.stringify(existingHabit), { status: 200 });
//   } catch (error) {
//     new Response("Failed to update habit", { status: 500 });
//   }
// };

// refactored PATCH to use findAndUpdate
export const PATCH = async (req, { params }) => {
  const { name, description, category } = await req.json();

  try {
    await connectToDB();

    const updatedHabit = await Habit.findByIdAndUpdate(
      params.id,
      { $set: { name: name, description: description, category: category } }, // The update operation
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

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    await Habit.findByIdAndDelete(params.id);

    new Response("Habit was deleted successfully", { status: 200 });
  } catch (error) {
    new Response("Failed to delete habit", { status: 500 });
  }
};
