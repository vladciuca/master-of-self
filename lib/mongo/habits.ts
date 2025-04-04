import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import {
  User,
  Habit,
  HabitAction,
  NewHabit,
  HabitUpdate,
  HabitActionUpdate,
  XpData,
} from "@models/mongodb";

let client: MongoClient;
let db: Db;
let habits: Collection<Habit>;
let users: Collection<User>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("master_of_self");
    habits = db.collection<Habit>("habits");
    users = db.collection<User>("users");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

// CREATE NEW HABIT =============================================================================
export async function createHabit(
  userId: string,
  name: string,
  icon: string,
  actions: HabitAction[]
): Promise<{ newHabit: Habit | null; error?: string }> {
  try {
    if (!habits) await init();

    const newHabit: NewHabit = {
      creatorId: new ObjectId(userId),
      name,
      icon,
      xp: 0, // initialize XP to 0
      xpData: [], // initialize XP chart data to empty array
      actions,
    };

    const result = await habits.insertOne(newHabit);

    if (!result.insertedId) {
      throw new Error("Failed to insert new habit");
    }

    return { newHabit: { ...newHabit, _id: result.insertedId } };
  } catch (error) {
    return { newHabit: null, error: "Failed to create new habit" };
  }
}

// UPDATE HABIT =================================================================================
export async function updateHabit(
  id: string,
  name: string,
  icon: string,
  actions: HabitAction[]
): Promise<{
  habit: Habit | null;
  error?: string;
}> {
  try {
    if (!habits) await init();
    const query = { _id: new ObjectId(id) };

    const update = {
      $set: {
        name: name,
        icon: icon,
        actions: actions,
      },
    };

    const habit = await habits.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!habit) {
      throw new Error("Habit not found");
    }

    return { habit };
  } catch (error) {
    return { habit: null, error: "Failed to update habit" };
  }
}

// DELETE HABIT =================================================================================
export async function deleteHabit(
  id: string
): Promise<{ success?: string; error?: string }> {
  try {
    if (!habits) await init();
    const query = { _id: new ObjectId(id) };

    const result = await habits.deleteOne(query);

    // Check if the habit was deleted (i.e., if the deletion was successful)
    if (result.deletedCount === 0) {
      throw new Error("Habit not found or could not be deleted");
    }

    return { success: "Habit deleted successfully" };
  } catch (error) {
    return { error: "Failed to fetch habits" };
  }
}

// GET HABIT ====================================================================================
export async function getHabit(id: string): Promise<{
  habit: Habit | null;
  error?: string;
}> {
  try {
    if (!habits) await init();
    const query = { _id: new ObjectId(id) };

    const habit = await habits.findOne(query);

    if (!habit) {
      throw new Error("Habit not found");
    }

    return { habit };
  } catch (error) {
    return { habit: null, error: "Failed to fetch habit" };
  }
}

// GET USER HABITS ==============================================================================
export async function getHabits(userId: string): Promise<{
  habits: Habit[] | null;
  error?: string;
}> {
  try {
    if (!habits) await init();
    const query = { creatorId: new ObjectId(userId) };

    const result = await habits.find(query).toArray();

    return { habits: result };
  } catch (error) {
    return { habits: null, error: "Failed to fetch habits" };
  }
}

// GET HABITS ICONS =============================================================================
export async function getHabitsIcons(ids: string[]): Promise<{
  iconMap: Record<string, { icon: string; xp: number }>;
  error?: string;
}> {
  try {
    if (!habits) await init();

    const habitIds = ids.map((id) => new ObjectId(id));
    const result = await habits.find({ _id: { $in: habitIds } }).toArray();

    const iconMap = result.reduce((acc, habit) => {
      acc[habit._id.toString()] = {
        icon: habit.icon,
        xp: habit.xp,
      };
      return acc;
    }, {} as Record<string, { icon: string; xp: number }>);

    return { iconMap };
  } catch (error) {
    console.error("Failed to fetch habit icons:", error);
    return { iconMap: {}, error: "Failed to fetch habit icons" };
  }
}

// UPDATE HABIT =================================================================================
export async function updateHabitsXpAndActions(
  //NOTE: updates habits XP
  habitXpUpdates: HabitUpdate[],
  //NOTE: updates Habit Action Values
  habitActionUpdates: HabitActionUpdate,
  //NOTE: updates Habits xpData[] for chart
  updateDate: string
): Promise<{
  updatedHabits: Habit[] | null;
  status: "success" | "no_change";
  // | "already_updated"
  error?: string;
}> {
  try {
    if (!habits) await init();

    const date = new Date(updateDate).toISOString().slice(0, 10);

    // Prepare XP update operations
    const xpBulkOps = habitXpUpdates.map(([id, xp]) => {
      //NOTE: xp chart data
      const xpData: XpData = [date, xp];
      return {
        updateOne: {
          filter: { _id: new ObjectId(id) },
          update: {
            $inc: { xp: xp },
            $push: { xpData },
          },
          upsert: false,
        },
      };
    });

    // Prepare action update operations
    const actionBulkOps = Object.entries(habitActionUpdates).flatMap(
      ([habitId, actionUpdates]) =>
        Object.entries(actionUpdates).map(([actionId, value]) => ({
          updateOne: {
            filter: {
              _id: new ObjectId(habitId),
              "actions.id": actionId,
            },
            update: {
              $inc: { "actions.$.value": value },
            },
          },
        }))
    );

    // If there are no updates to perform, return early
    if (xpBulkOps.length === 0 && actionBulkOps.length === 0) {
      return {
        updatedHabits: [],
        status: "no_change",
      };
    }

    // Combine all operations
    const allBulkOps = [...xpBulkOps, ...actionBulkOps];

    // Execute all updates
    const result = await habits.bulkWrite(allBulkOps);

    // Verify all updates were successful
    const expectedXpUpdates = habitXpUpdates.length;
    const expectedActionUpdates = Object.values(habitActionUpdates).reduce(
      (acc, actions) => acc + Object.keys(actions).length,
      0
    );
    const totalExpectedUpdates = expectedXpUpdates + expectedActionUpdates;

    if (result.modifiedCount !== totalExpectedUpdates) {
      console.warn(
        `Expected ${totalExpectedUpdates} updates, but ${result.modifiedCount} were modified.`
      );
    }

    // Get all updated habits using a simple object to deduplicate IDs
    const xpHabitIds = habitXpUpdates.map(([id]) => id);
    const actionHabitIds = Object.keys(habitActionUpdates);
    const uniqueHabitIds: { [key: string]: boolean } = {};

    xpHabitIds.forEach((id) => (uniqueHabitIds[id] = true));
    actionHabitIds.forEach((id) => (uniqueHabitIds[id] = true));

    const allHabitIds = Object.keys(uniqueHabitIds);

    const updatedHabits = await habits
      .find({
        _id: { $in: allHabitIds.map((id) => new ObjectId(id)) },
      })
      .toArray();

    return {
      updatedHabits,
      status: "success",
    };
  } catch (error) {
    console.error("Failed to update habits", error);
    return {
      updatedHabits: null,
      status: "no_change",
      error: "Failed to update user disciplines",
    };
  }
}
