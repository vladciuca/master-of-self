import { NextRequest } from "next/server";
import { connectToDB } from "@utils/database";
import JournalEntry, { JournalEntryType } from "@models/journalEntry";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const journalEntries: JournalEntryType[] = await JournalEntry.find(
      {}
    ).populate("creator");

    return new Response(JSON.stringify(journalEntries), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all habits", { status: 500 });
  }
};
