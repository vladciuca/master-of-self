import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import {
  Habit,
  Action,
  NewHabit,
  HabitUpdate,
  HabitActionUpdate,
  XpData,
} from "@/app/types/mongodb";

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

// CREATE NEW HABIT =============================================================================
export async function createHabit(
  userId: string,
  name: string,
  icon: string,
  description: string,
  actions: Action[]
): Promise<{ newHabit: Habit | null; error?: string }> {
  try {
    if (!habits) await init();

    const newHabit: NewHabit = {
      creatorId: new ObjectId(userId),
      name,
      icon,
      description,
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
  description: string,
  actions: Action[]
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
        description: description,
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
// UPDATE HABIT XP - [received an array and modified an object with the array] ==================
export async function updateHabitsXp(
  habitUpdates: HabitUpdate[]
): Promise<{ updatedHabits: Habit[]; error?: string }> {
  try {
    if (!habits) await init();

    const date = new Date().toISOString().slice(0, 10);

    const bulkOps = habitUpdates.map(([id, xp]) => {
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

    const result = await habits.bulkWrite(bulkOps);

    if (result.modifiedCount !== habitUpdates.length) {
      throw new Error("Some habits were not updated");
    }

    const updatedHabitsIds = habitUpdates.map(([id]) => new ObjectId(id));
    const updatedHabits = await habits
      .find({ _id: { $in: updatedHabitsIds } })
      .toArray();

    // console.log("===============IN_DB_OPERATIONS updatedHabits", updatedHabits);

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
    console.error("Failed to update habits XP", error); // test
    return { updatedHabits: [], error: "Failed to update habits XP" };
  }
}

// UPDATE HABIT ACTION VALUES ===================================================================
export async function updateHabitsActions(
  habitActionUpdates: HabitActionUpdate
): Promise<{ updatedHabits: Habit[]; error?: string }> {
  try {
    if (!habits) await init();

    const bulkOps = Object.entries(habitActionUpdates).flatMap(
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

    const result = await habits.bulkWrite(bulkOps);

    const totalActionsToUpdate = Object.values(habitActionUpdates).reduce(
      (acc, actions) => acc + Object.keys(actions).length,
      0
    );

    if (result.modifiedCount !== totalActionsToUpdate) {
      console.warn(
        `Expected to update ${totalActionsToUpdate} actions, but only ${result.modifiedCount} were modified.`
      );
    }

    const updatedHabitsIds = Object.keys(habitActionUpdates).map(
      (id) => new ObjectId(id)
    );
    const updatedHabits = await habits
      .find({ _id: { $in: updatedHabitsIds } })
      .toArray();

    return { updatedHabits };
  } catch (error) {
    console.error("Failed to update habits actions", error);
    return { updatedHabits: [], error: "Failed to update habits actions" };
  }
}
