import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import type { User, Discipline, NewDiscipline } from "@models/mongodb";
import type { JournalStepType } from "@models/types";
import { ReactNode } from "@node_modules/@types/react";

let client: MongoClient;
let db: Db;
let disciplines: Collection<Discipline>;
let users: Collection<User>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("master_of_self");
    disciplines = db.collection<Discipline>("disciplines");
    users = db.collection<User>("users");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

// CREATE NEW DISCIPLINE STEP =====================================================================
export async function createDiscipline(
  userId: string,
  discipline: string,
  icon: string,
  color: string,
  type: JournalStepType,
  title: string,
  description: string
): Promise<{ newDiscipline: Discipline | null; error?: string }> {
  try {
    if (!disciplines) await init();

    //NOTE: maybe name this newDisciplineStep?
    const newDiscipline: NewDiscipline = {
      creatorId: new ObjectId(userId),
      discipline,
      icon,
      color,
      type,
      title,
      description,
    };

    const result = await disciplines.insertOne(newDiscipline);

    if (!result.insertedId) {
      throw new Error("Failed to insert new discipline");
    }

    return { newDiscipline: { ...newDiscipline, _id: result.insertedId } };
  } catch (error) {
    return { newDiscipline: null, error: "Failed to create new discipline" };
  }
}

// UPDATE DISCIPLINE STEP =============================================================
export async function updateDiscipline(
  id: string,
  discipline: string,
  icon: string,
  color: string,
  type: JournalStepType,
  title: string,
  description: string
): Promise<{
  disciplineStep: Discipline | null;
  error?: string;
}> {
  try {
    if (!disciplines) await init();
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

    const disciplineStep = await disciplines.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!disciplineStep) {
      throw new Error("Discipline not found");
    }

    return { disciplineStep };
  } catch (error) {
    return { disciplineStep: null, error: "Failed to update discipline" };
  }
}

// GET DISCIPLINE STEP ================================================================
export async function getDiscipline(id: string): Promise<{
  discipline: Discipline | null;
  error?: string;
}> {
  try {
    if (!disciplines) await init();
    const query = { _id: new ObjectId(id) };

    //NOTE: and name this to discipline Step?
    const discipline = await disciplines.findOne(query);

    if (!discipline) {
      throw new Error("Discipline not found");
    }

    return { discipline };
  } catch (error) {
    return { discipline: null, error: "Failed to fetch discipline" };
  }
}

// GET USER DISCIPLINE STEPS =================================================
export async function getDisciplines(userId: string): Promise<{
  disciplines: Discipline[] | null;
  error?: string;
}> {
  try {
    if (!disciplines) await init();
    const query = { creatorId: new ObjectId(userId) };

    const result = await disciplines.find(query).toArray();

    return { disciplines: result };
  } catch (error) {
    return { disciplines: null, error: "Failed to fetch habits" };
  }
}

// GET ALL DISCIPLINES (across all users) =========================================
//NOTE: not used
// export async function getAllDisciplines(): Promise<{
//   disciplines: Discipline[] | null;
//   error?: string;
// }> {
//   try {
//     if (!disciplines) await init();

//     // No query filter means get all documents
//     const result = await disciplines.find({}).toArray();

//     return { disciplines: result };
//   } catch (error) {
//     return { disciplines: null, error: "Failed to fetch all disciplines" };
//   }
// }

// GET ALL DISCIPLINES (excluding specific user) =========================================
export async function getAllDisciplinesExceptUser(
  excludeUserId: string
): Promise<{
  disciplines: Discipline[] | null;
  error?: string;
}> {
  try {
    if (!disciplines) await init();

    // Query that excludes the specified user
    const query = { creatorId: { $ne: new ObjectId(excludeUserId) } };

    const result = await disciplines.find(query).toArray();

    return { disciplines: result };
  } catch (error) {
    return { disciplines: null, error: "Failed to fetch disciplines" };
  }
}

// GET DISCIPLINES BY IDS ============================================================
export async function getDisciplinesByIds(disciplineIds: string[]): Promise<{
  disciplines: Discipline[] | null;
  error?: string;
}> {
  try {
    if (!disciplines) await init();

    // Convert string IDs to ObjectId array, filtering out any invalid IDs
    const objectIds = disciplineIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    // If no valid IDs, return empty array
    if (objectIds.length === 0) {
      return { disciplines: [] };
    }

    // Use proper type for query
    const query = { _id: { $in: objectIds } as any };
    const result = await disciplines.find(query).toArray();

    return { disciplines: result };
  } catch (error) {
    console.error("Error fetching disciplines by IDs:", error);
    return { disciplines: null, error: "Failed to fetch disciplines by IDs" };
  }
}
