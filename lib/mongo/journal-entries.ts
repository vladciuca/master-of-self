import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { JournalEntry, NewJournalEntry } from "@/app/types/mongodb";
import { WeeklyWillpowerData } from "@app/types/types";

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
  userToday: string,
  userTomorrow: string
): Promise<{ newJournalEntry: JournalEntry | null; error?: string }> {
  try {
    if (!journalEntries) await init();

    // Check if an entry for today already exists
    const today = new Date(userToday);
    const tomorrow = new Date(userTomorrow);

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
      createDate: today,
      dailyWillpower,
      bonusWillpower,
      dayEntry: {},
      nightEntry: {},
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
// ADD USER LOCAL TIME PASSED AS PARAM
export async function getTodaysJournalEntry(
  userId: string,
  userToday: string,
  userTomorrow: string
): Promise<{
  todaysJournalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    // Set up the date range for today (00:00:00 to 23:59:59)
    const today = new Date(userToday);
    const tomorrow = new Date(userTomorrow);

    const todaysJournalEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      createDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    return { todaysJournalEntry: todaysJournalEntry || null };
  } catch (error) {
    console.error("Error fetching today's journal entry:", error);
    return { todaysJournalEntry: null };
  }
}

// GET YESTERDAYS'S USER JOURNAL ENTRY ==========================================================
export async function getYesterdaysJournalEntry(
  userId: string,
  userToday: string,
  userYesterday: string
): Promise<{
  yesterdaysJournalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    // Set up the date range for yesterday (00:00:00 to 23:59:59)
    const yesterday = new Date(userYesterday);
    const today = new Date(userToday);

    const yesterdaysJournalEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      createDate: {
        $gte: yesterday,
        $lte: today,
      },
    });

    return { yesterdaysJournalEntry: yesterdaysJournalEntry || null };
  } catch (error) {
    console.error("Error fetching yesterday's journal entry:", error);
    // Change: Return null instead of an error
    return { yesterdaysJournalEntry: null };
  }
}

// GET WEEKLY WILLPOWER DATA ====================================================================
export async function getWeeklyWillpowerData(
  userId: string,
  userStartOfWeek: string,
  userEndOfWeek: string
): Promise<{
  weeklyWillpower: WeeklyWillpowerData[] | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    const startOfWeek = new Date(userStartOfWeek);
    const endOfWeek = new Date(userEndOfWeek);

    const journalEntriesData = await journalEntries
      .find({
        creatorId: new ObjectId(userId),
        createDate: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      })
      .sort({ createDate: 1 })
      .toArray();

    // Create an array of all days in the week (Monday to Sunday)
    const allDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day.toISOString().split("T")[0];
    });

    // Create a map of existing entries
    const entriesMap = new Map(
      journalEntriesData.map((entry) => [
        entry.createDate.toISOString().split("T")[0],
        {
          generatedWillpower:
            (entry.dailyWillpower as number) - (entry.bonusWillpower as number),
          bonusWillpower: Number(entry.bonusWillpower),
        },
      ])
    );

    // Process the data for the chart, including all days
    const weeklyWillpower: WeeklyWillpowerData[] = allDays.map((dateString) => {
      const entry = entriesMap.get(dateString) || {
        generatedWillpower: 0,
        bonusWillpower: 0,
      };
      return {
        date: dateString,
        generatedWillpower: entry.generatedWillpower,
        bonusWillpower: entry.bonusWillpower,
      };
    });

    return { weeklyWillpower };
  } catch (error) {
    console.error("Failed to fetch weekly willpower data", error);
    return {
      weeklyWillpower: null,
      error: "Failed to fetch weekly willpower data",
    };
  }
}

// GET TOTAL WILLPOWER ==========================================================================
export async function getTotalWillpower(userId: string): Promise<{
  totalWillpower: number;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    const pipeline = [
      {
        $match: {
          creatorId: new ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalWillpower: { $sum: "$dailyWillpower" },
        },
      },
    ];

    const result = await journalEntries.aggregate(pipeline).toArray();

    if (result.length === 0) {
      return { totalWillpower: 0 };
    }

    return { totalWillpower: result[0].totalWillpower };
  } catch (error) {
    console.error("Failed to calculate total willpower", error);
    return {
      totalWillpower: 0,
      error: "Failed to calculate total willpower",
    };
  }
}

// GET CURRENT WILLPOWER ========================================================================
export async function getCurrentWillpower(
  userId: string,
  userToday: string
): Promise<{
  currentWillpower: number;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    // Set up the date for the start of today
    const today = new Date(userToday);

    const pipeline = [
      {
        $match: {
          creatorId: new ObjectId(userId),
          createDate: { $lt: today },
        },
      },
      {
        $group: {
          _id: null,
          currentWillpower: { $sum: "$dailyWillpower" },
        },
      },
    ];

    const result = await journalEntries.aggregate(pipeline).toArray();

    if (result.length === 0) {
      return { currentWillpower: 0 };
    }

    return { currentWillpower: result[0].currentWillpower };
  } catch (error) {
    console.error("Failed to calculate current willpower", error);
    return {
      currentWillpower: 0,
      error: "Failed to calculate current willpower",
    };
  }
}
