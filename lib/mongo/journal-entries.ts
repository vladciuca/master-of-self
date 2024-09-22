import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { JournalEntry, NewJournalEntry } from "@/app/types/mongodb";

let client: MongoClient;
let db: Db;
let journalEntries: Collection<JournalEntry>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("master_of_self");
    journalEntries = db.collection<JournalEntry>("journalentries");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

// CREATE NEW JOURNAL ENTRY ====================================================================
export async function createJournalEntry(
  userId: string,
  dailyWillpower: number,
  bonusWillpower: number,
  dayEntry: object,
  nightEntry: object
): Promise<{ newJournalEntry: JournalEntry | null; error?: string }> {
  try {
    if (!journalEntries) await init();

    // Check if an entry for today already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      createDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (existingEntry) {
      return {
        newJournalEntry: null,
        error: "An entry for today already exists",
      };
    }

    // If no entry exists, create a new one
    const newJournalEntry: NewJournalEntry = {
      creatorId: new ObjectId(userId),
      createDate: new Date(),
      dailyWillpower,
      bonusWillpower,
      dayEntry,
      nightEntry,
    };

    const result = await journalEntries.insertOne(newJournalEntry);

    if (!result.insertedId) {
      throw new Error("Failed to insert new journal entry");
    }

    return { newJournalEntry: { ...newJournalEntry, _id: result.insertedId } };
  } catch (error) {
    console.error("Failed to create new journal entry", error); // test
    return {
      newJournalEntry: null,
      error: "Failed to create new journal entry",
    };
  }
}

// UPDATE JOURNAL ENTRY ========================================================================
export async function updateJournalEntry(
  id: string,
  dailyWillpower: number,
  dayEntry: object,
  nightEntry: object
  //   type: string
): Promise<{
  journalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    const query = { _id: new ObjectId(id) };

    const update = { $set: { dailyWillpower, dayEntry, nightEntry } };

    const journalEntry = await journalEntries.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    return { journalEntry };
  } catch (error) {
    return { journalEntry: null, error: "Failed to update journal entry" };
  }
}

// DELETE JOURNAL ENTRY ========================================================================

// GET JOURNAL ENTRY ===========================================================================
export async function getJournalEntry(id: string): Promise<{
  journalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();
    const query = { _id: new ObjectId(id) };

    const journalEntry = await journalEntries.findOne(query);

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    return { journalEntry };
  } catch (error) {
    return { journalEntry: null, error: "Failed to fetch journal entry" };
  }
}

// GET USER JOURNAL ENTRIES ====================================================================
export async function getJournalEntries(userId: string): Promise<{
  journalEntries: JournalEntry[] | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();
    const query = { creatorId: new ObjectId(userId) };

    const result = await journalEntries.find(query).toArray();

    return { journalEntries: result };
  } catch (error) {
    return { journalEntries: null, error: "Failed to fetch journal entries" };
  }
}

// GET TODAY'S USER JOURNAL ENTRY ===============================================================
export async function getTodaysJournalEntry(userId: string): Promise<{
  todaysJournalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    // Set up the date range for today (00:00:00 to 23:59:59)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysJournalEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      createDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (!todaysJournalEntry) {
      return {
        todaysJournalEntry: null,
        error: "An entry for today already exists",
      };
    }

    return { todaysJournalEntry: todaysJournalEntry };
  } catch (error) {
    return {
      todaysJournalEntry: null,
      error: "Failed to fetch today's journal entry",
    };
  }
}

// GET YESTERDAYS'S USER JOURNAL ENTRY ==========================================================
export async function getYesterdaysJournalEntry(userId: string): Promise<{
  yesterdaysJournalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    // Set up the date range for yesterday (00:00:00 to 23:59:59)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    const yesterdaysJournalEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      createDate: {
        $gte: yesterday,
        $lt: today,
      },
    });

    return { yesterdaysJournalEntry };
  } catch (error) {
    return {
      yesterdaysJournalEntry: null,
      error: "Failed to fetch yesterdays's journal entry",
    };
  }
}
