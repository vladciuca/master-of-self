// import { MongoClient, Db, Collection, ObjectId } from "mongodb";
// import clientPromise from "./mongodb";
// import type { User, Journey, NewJourney } from "@models/mongodb";

// let client: MongoClient;
// let db: Db;
// let journeys: Collection<Journey>;
// let users: Collection<User>;

// async function init() {
//   if (db) return;
//   try {
//     client = await clientPromise;
//     db = client.db("master_of_self");
//     journeys = db.collection<Journey>("journeys");
//     users = db.collection<User>("users");
//   } catch (error) {
//     throw new Error("Failed to establish connection to database");
//   }
// }

// (async () => {
//   await init();
// })();

// // CREATE NEW DISCIPLINE STEP =====================================================================
// export async function createJourney(
//   userId: string,
//   journey: string
// ): Promise<{ newJourney: Journey | null; error?: string }> {
//   try {
//     if (!journeys) await init();

//     //NOTE: maybe name this newDisciplineStep?
//     const newJourney: NewJourney = {
//       creatorId: new ObjectId(userId),
//       journey,
//     };

//     const result = await journeys.insertOne(newJourney);

//     if (!result.insertedId) {
//       throw new Error("Failed to insert new journey");
//     }

//     return { newJourney: { ...newJourney, _id: result.insertedId } };
//   } catch (error) {
//     return { newJourney: null, error: "Failed to create new discipline" };
//   }
// }
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import type { User, Journey, NewJourney } from "@models/mongodb";

// Define the RoadmapData interface
interface RoadmapData {
  title: string;
  description: string;
  totalMonths: number;
  roadmap: Array<{
    month: number;
    title: string;
    focus: string;
    milestones: string[];
    actionPoints: string[];
  }>;
}

let client: MongoClient;
let db: Db;
let journeys: Collection<Journey>;
let users: Collection<User>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("master_of_self");
    journeys = db.collection<Journey>("journeys");
    users = db.collection<User>("users");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

// CREATE NEW JOURNEY ===========================================================================
export async function createJourney(
  userId: string,
  roadmapData: RoadmapData
): Promise<{ newJourney: Journey | null; error?: string }> {
  try {
    if (!journeys) await init();

    const newJourney: NewJourney = {
      creatorId: new ObjectId(userId),
      roadmapData,
      createdAt: new Date(),
    };

    const result = await journeys.insertOne(newJourney);

    if (!result.insertedId) {
      throw new Error("Failed to insert new journey");
    }

    return { newJourney: { ...newJourney, _id: result.insertedId } };
  } catch (error) {
    return { newJourney: null, error: "Failed to create new journey" };
  }
}

// GET USER JOURNEYS ============================================================================
export async function getJourneys(userId: string): Promise<{
  journeys: Journey[] | null;
  error?: string;
}> {
  try {
    if (!journeys) await init();
    const query = { creatorId: new ObjectId(userId) };

    const result = await journeys.find(query).sort({ createdAt: -1 }).toArray();

    return { journeys: result };
  } catch (error) {
    return { journeys: null, error: "Failed to fetch journeys" };
  }
}

// GET SINGLE JOURNEY ===========================================================================
export async function getJourney(id: string): Promise<{
  journey: Journey | null;
  error?: string;
}> {
  try {
    if (!journeys) await init();
    const query = { _id: new ObjectId(id) };

    const journey = await journeys.findOne(query);

    if (!journey) {
      throw new Error("Journey not found");
    }

    return { journey };
  } catch (error) {
    return { journey: null, error: "Failed to fetch journey" };
  }
}

// DELETE JOURNEY ===============================================================================
export async function deleteJourney(
  id: string
): Promise<{ success?: string; error?: string }> {
  try {
    if (!journeys) await init();
    const query = { _id: new ObjectId(id) };

    const result = await journeys.deleteOne(query);

    if (result.deletedCount === 0) {
      throw new Error("Journey not found or could not be deleted");
    }

    return { success: "Journey deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete journey" };
  }
}
