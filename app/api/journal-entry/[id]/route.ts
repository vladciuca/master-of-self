import { connectToDB } from "@utils/database";
import { NextResponse, NextRequest } from "next/server";
import JournalEntry from "@models/journalEntry";

interface Params {
  id: string;
}

export const PATCH = async (req: NextRequest, params: Params) => {
  const { dayEntry, nightEntry, type } = await req.json();

  try {
    await connectToDB();
    let updatedJournalEntry;

    if (type === "day") {
      updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
        params.id,
        { $set: { dayEntry } },
        { new: true }
      );
    } else {
      updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
        params.id,
        { $set: { nightEntry } },
        { new: true }
      );
    }

    if (!updatedJournalEntry) {
      return new NextResponse("Journal entry not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(updatedJournalEntry), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Failed to update journal entry", { status: 500 });
  }
};
