import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { Habit, NewHabit, HabitUpdate } from "@/app/types/mongodb";

let client: MongoClient;
let db: Db;
let habits: Collection<Habit>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("master_of_self");
    habits = db.collection<Habit>("habits");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

// CREATE NEW HABIT
export async function createHabit(
  userId: string,
  name: string,
  icon: string,
  description: string
): Promise<{ newHabit: Habit; error?: string }> {
  try {
    if (!habits) await init();

    const newHabit: NewHabit = {
      creator: new ObjectId(userId),
      name,
      icon,
      description,
      xp: 0, // initialize XP to 0
    };

    const result = await habits.insertOne(newHabit);

    if (!result.insertedId) {
      throw new Error("Failed to insert new habit");
    }

    return { newHabit: { ...newHabit, _id: result.insertedId } };
  } catch (error) {
    console.error("Failed to create new habit", error);
    return { newHabit: {} as Habit, error: "Failed to create new habit" };
  }
}

// GET USER HABITS
export async function getHabits(userId: string): Promise<{
  habits: Habit[];
  error?: string;
}> {
  try {
    if (!habits) await init();
    const query = { creator: new ObjectId(userId) };

    const result = await habits.find(query).toArray();

    return { habits: result };
  } catch (error) {
    console.error("Failed to fetch habits", error);
    return { habits: [], error: "Failed to fetch habits" };
  }
}

// UPDATE HABIT XP - [received an array and modified an object with the array]
export async function updateHabitsXp(
  habitUpdates: HabitUpdate[]
): Promise<{ updatedHabits: Habit[]; error?: string }> {
  try {
    if (!habits) await init();

    const bulkOps = habitUpdates.map(([id, xp]) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $inc: { xp: xp } },
        upsert: false,
      },
    }));

    const result = await habits.bulkWrite(bulkOps);

    if (result.modifiedCount !== habitUpdates.length) {
      throw new Error("Some habits were not updated");
    }

    const updatedHabitsIds = habitUpdates.map(([id]) => new ObjectId(id));
    const updatedHabits = await habits
      .find({ _id: { $in: updatedHabitsIds } })
      .toArray();

    return { updatedHabits };

    // !!! For moving the conversion from object to array here
    // const updateObject: { [key: string]: any } = {};
    // for (const [habitId, xpChange] of Object.entries(habitUpdates)) {
    //   updateObject[`habits.${habitId}`] = xpChange;
    // }

    // const result = await users.findOneAndUpdate(
    //   { _id: new ObjectId(userId) },
    //   { $inc: updateObject },
    //   { returnDocument: 'after' }
    // );

    // if (!result.value) {
    //   throw new Error("User not found or habits not updated");
    // }

    // return { updatedDocument: result.value };
  } catch (error) {
    console.error("Failed to update habits XP", error);
    return { updatedHabits: [], error: "Failed to update habits XP" };
  }
}
