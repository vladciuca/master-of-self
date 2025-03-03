import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { JournalEntry, NewJournalEntry } from "@models/mongodb";
import { WeeklyWillpowerData, JournalEntryHabit } from "@models/types";

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
  // userTomorrow: string,
  defaultHabitsValues: JournalEntryHabit
): Promise<{ newJournalEntry: JournalEntry | null; error?: string }> {
  try {
    if (!journalEntries) await init();

    // Check if an entry for today already exists
    const today = new Date(userToday);
    // const tomorrow = new Date(userTomorrow);

    //NOTE* check here if we need both DATES
    //we should not
    const existingEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      createDate: {
        // $gte: today,
        // $lt: tomorrow,
        $eq: today,
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
      habits: defaultHabitsValues,
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
  nightEntry: object,
  habits: JournalEntryHabit
): Promise<{
  journalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    const query = { _id: new ObjectId(id) };

    const update = { $set: { dailyWillpower, dayEntry, nightEntry, habits } };

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

// UPDATE JOURNAL ENTRY HABITS ==================================================================
export async function updateJournalEntryHabits(
  id: string,
  habits: JournalEntryHabit
): Promise<{
  journalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    const query = { _id: new ObjectId(id) };

    // Only update the habits field
    const update = { $set: { habits } };

    const journalEntry = await journalEntries.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    return { journalEntry };
  } catch (error) {
    console.error("Error updating journal entry habits:", error);
    return {
      journalEntry: null,
      error: "Failed to update journal entry habits",
    };
  }
}

// DELETE JOURNAL ENTRY ========================================================================

// GET INDIVIDUAL JOURNAL ENTRY ================================================================
// NOTE: should add user id here? is it required?
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
export async function getTodaysJournalEntry(
  userId: string,
  userToday: string
): Promise<{
  todaysJournalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    // convert the Date from string to Date obj
    const today = new Date(userToday);

    const todaysJournalEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      // we always use 00:00 time stamps when creating a new entry by default
      // so for this we can use directly equals exact date to find the corresponding entry
      createDate: {
        $eq: today,
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
  userYesterday: string
): Promise<{
  yesterdaysJournalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    // convert the Date from string to Date obj
    const yesterday = new Date(userYesterday);

    const yesterdaysJournalEntry = await journalEntries.findOne({
      creatorId: new ObjectId(userId),
      // we always use 00:00 time stamps when creating a new entry by default
      // so for this we can use directly equals exact date to find the corresponding entry
      createDate: {
        $eq: yesterday,
      },
    });

    return { yesterdaysJournalEntry: yesterdaysJournalEntry || null };
  } catch (error) {
    console.error("Error fetching yesterday's journal entry:", error);
    // Change: Return null instead of an error
    return { yesterdaysJournalEntry: null };
  }
}

// GET LAST USER JOURNAL ENTRY ==================================================================
export async function getLastJournalEntry(userId: string): Promise<{
  lastJournalEntry: JournalEntry | null;
  error?: string;
}> {
  try {
    if (!journalEntries) await init();

    const lastJournalEntry = await journalEntries
      .find({ creatorId: new ObjectId(userId) })
      .sort({ createDate: -1 })
      .limit(1)
      .toArray();

    return { lastJournalEntry: lastJournalEntry[0] || null };
  } catch (error) {
    console.error("Error fetching last journal entry:", error);
    return {
      lastJournalEntry: null,
      error: "Failed to fetch last journal entry",
    };
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
          // generatedWillpower:
          //   (entry.dailyWillpower as number) - (entry.bonusWillpower as number),
          generatedWillpower: Number(entry.dailyWillpower),
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
// NOTE* combine this two DB functions into one?
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
          // totalWillpower: { $sum: "$dailyWillpower" },
          totalWillpower: {
            $sum: {
              $add: ["$dailyWillpower", "$bonusWillpower"],
            },
          },
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

// GET TOTAL WILLPOWER BEFORE TODAY ==============================================================
export async function getTotalWillpowerBeforeToday(
  userId: string,
  userToday: string
): Promise<{
  totalWillpowerBeforeToday: number;
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
          // totalWillpowerBeforeToday: { $sum: "$dailyWillpower" },
          totalWillpowerBeforeToday: {
            $sum: {
              $add: ["$dailyWillpower", "$bonusWillpower"],
            },
          },
        },
      },
    ];

    const result = await journalEntries.aggregate(pipeline).toArray();

    if (result.length === 0) {
      return { totalWillpowerBeforeToday: 0 };
    }

    return { totalWillpowerBeforeToday: result[0].totalWillpowerBeforeToday };
  } catch (error) {
    console.error("Failed to calculate current willpower", error);
    return {
      totalWillpowerBeforeToday: 0,
      error: "Failed to calculate current willpower",
    };
  }
}
