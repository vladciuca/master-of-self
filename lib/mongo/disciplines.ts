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
