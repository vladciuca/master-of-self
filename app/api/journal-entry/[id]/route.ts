import { connectToDB } from "@utils/database";
import { NextResponse, NextRequest } from "next/server";
import JournalEntry from "@models/journalEntry";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { dailyWillpower, dayEntry, nightEntry, type } = await req.json();

  try {
    await connectToDB();
    let updatedJournalEntry;

    // refactor logic when implementing separate Day / Night Forms
    if (type === "day") {
      updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
        params.id,
        { $set: { dayEntry } },
        { new: true }
      );
    } else if (type === "night") {
      updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
        params.id,
        { $set: { nightEntry } },
        { new: true }
      );
    } else {
      updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
        params.id,
        { $set: { dailyWillpower, dayEntry, nightEntry } },
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

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const updatedJournalEntry = await JournalEntry.findById(params.id);

    if (!updatedJournalEntry) {
      return new NextResponse("Journal entry not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(updatedJournalEntry), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Failed to get journal entry", { status: 500 });
  }
};
