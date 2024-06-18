import { connectToDB } from "@/utils/database";
import Habit from "@/models/habit";

export const POST = async (req, res) => {
  const { userId, name, icon, description, categories } = await req.json();

  try {
    await connectToDB();
    const newHabit = new Habit({
      creator: userId,
      name,
      icon,
      description,
      categories,
    });

    await newHabit.save();

    return new Response(JSON.stringify(newHabit), { status: 201 });
  } catch (error) {
    return new Response("Failed to create new habit", { status: 500 });
  }
};
