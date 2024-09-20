import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@lib/database";
import JournalEntry, { JournalEntryInterface } from "@models/journalEntry";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const journalEntries: JournalEntryInterface[] = await JournalEntry.find(
      {}
    ).populate("creator");

    return new NextResponse(JSON.stringify(journalEntries), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch all habits", { status: 500 });
  }
};
