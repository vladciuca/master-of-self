import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import type { User, Practice, NewPractice } from "@models/mongodb";
import type { JournalStepType } from "@models/types";

let client: MongoClient;
let db: Db;
let practices: Collection<Practice>;
let users: Collection<User>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("master_of_self");
    practices = db.collection<Practice>("practices");
    users = db.collection<User>("users");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

// CREATE NEW PRACTICE STEP =====================================================================
export async function createPractice(
  userId: string,
  discipline: string,
  icon: string,
  color: string,
  type: JournalStepType,
  title: string,
  description: string
): Promise<{ newPractice: Practice | null; error?: string }> {
  try {
    if (!practices) await init();

    const newPractice: NewPractice = {
      creatorId: userId,
      discipline,
      icon,
      color,
      type,
      title,
      description,
    };

    const result = await practices.insertOne(newPractice);

    if (!result.insertedId) {
      throw new Error("Failed to insert new practice");
    }

    return { newPractice: { ...newPractice, _id: result.insertedId } };
  } catch (error) {
    return { newPractice: null, error: "Failed to create new practice" };
  }
}

// UPDATE PRACTICE STEP =============================================================
export async function updatePractice(
  id: string,
  discipline: string,
  icon: string,
  color: string,
  type: JournalStepType,
  title: string,
  description: string
): Promise<{
  practiceStep: Practice | null;
  error?: string;
}> {
  try {
    if (!practices) await init();
    const query = { _id: new ObjectId(id) };

    const update = {
      $set: {
        discipline,
        icon,
        color,
        type,
        title,
        description,
      },
    };

    const practiceStep = await practices.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!practiceStep) {
      throw new Error("Practice not found");
    }

    return { practiceStep };
  } catch (error) {
    return { practiceStep: null, error: "Failed to update practice" };
  }
}

// DELETE PRACTICE STEP =====================================================================
export async function deletePractice(
  practiceId: string,
  userId: string
): Promise<{ success?: string; error?: string }> {
  try {
    if (!practices || !users) await init();
    const query = { _id: new ObjectId(practiceId), creatorId: userId };

    const result = await practices.deleteOne(query);

    if (result.deletedCount === 0) {
      throw new Error("Practice not found or could not be deleted");
    }

    await users.updateOne(
      { _id: userId },
      {
        $pull: {
          "profile.activePractices": practiceId,
        },
        $unset: { [`profile.practices.${practiceId}`]: "" },
      }
    );

    return { success: "Practice deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete practice" };
  }
}

// GET PRACTICE STEP ================================================================
export async function getPractice(id: string): Promise<{
  practice: Practice | null;
  error?: string;
}> {
  try {
    if (!practices) await init();
    const query = { _id: new ObjectId(id) };

    const practice = await practices.findOne(query);

    if (!practice) {
      throw new Error("Practice not found");
    }

    return { practice };
  } catch (error) {
    return { practice: null, error: "Failed to fetch practice" };
  }
}

// GET USER PRACTICE STEPS =================================================
export async function getPractices(userId: string): Promise<{
  practices: Practice[] | null;
  error?: string;
}> {
  try {
    if (!practices) await init();
    const query = { creatorId: userId };

    const result = await practices.find(query).toArray();

    return { practices: result };
  } catch (error) {
    return { practices: null, error: "Failed to fetch practices" };
  }
}

// GET ALL PRACTICES (excluding specific user) =========================================
export async function getAllPracticesExceptUser(
  excludeUserId: string
): Promise<{
  practices: Practice[] | null;
  error?: string;
}> {
  try {
    if (!practices) await init();

    // Query that excludes the specified user
    const query = { creatorId: { $ne: excludeUserId } };

    const result = await practices.find(query).toArray();

    return { practices: result };
  } catch (error) {
    return { practices: null, error: "Failed to fetch practices" };
  }
}

// GET PRACTICES BY IDS ============================================================
export async function getPracticesByIds(practiceIds: string[]): Promise<{
  practices: Practice[] | null;
  error?: string;
}> {
  try {
    if (!practices) await init();

    // Convert string IDs to ObjectId array, filtering out any invalid IDs
    const objectIds = practiceIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    // If no valid IDs, return empty array
    if (objectIds.length === 0) {
      return { practices: [] };
    }

    // Use proper type for query
    const query = { _id: { $in: objectIds } };
    const result = await practices.find(query).toArray();

    return { practices: result };
  } catch (error) {
    console.error("Error fetching practices by IDs:", error);
    return { practices: null, error: "Failed to fetch practices by IDs" };
  }
}

export async function getPracticesInfo(ids: string[]): Promise<{
  infoMap: Record<
    string,
    { name: string; icon: string; title?: string; color?: string }
  >;
  error?: string;
}> {
  try {
    if (!practices) await init();

    const practiceIds = ids.map((id) => new ObjectId(id));
    const result = await practices
      .find({ _id: { $in: practiceIds } })
      .toArray();

    const infoMap = result.reduce((acc, practice) => {
      acc[practice._id.toString()] = {
        name: practice.discipline,
        icon: practice.icon,
        title: practice.title || practice.discipline,
        color: practice.color || "primary",
      };
      return acc;
    }, {} as Record<string, { name: string; icon: string; title?: string; color?: string }>);

    return { infoMap };
  } catch (error) {
    console.error("Failed to fetch practice info:", error);
    return { infoMap: {}, error: "Failed to fetch practice info" };
  }
}
