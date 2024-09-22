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

// DELETE JOURNAL ENTRY ========================================================================

// GET JOURNAL ENTRY ===========================================================================

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
    return { journalEntries: null, error: "Failed to fetch habits" };
  }
}
