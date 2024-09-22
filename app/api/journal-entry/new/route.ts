import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@lib/mongoose";
import JournalEntry, { JournalEntryInterface } from "@models/journalEntry";

export const POST = async (req: NextRequest) => {
  const { userId, dailyWillpower, bonusWillpower, dayEntry, nightEntry } =
    await req.json();

  try {
    // await connectToDB();

    // Check if an entry for today already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await JournalEntry.findOne({
      creator: userId,
      createDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (existingEntry) {
      return new NextResponse("An entry for today already exists", {
        status: 400,
      });
    }

    // If no entry exists, create a new one
    const newJournalEntry: JournalEntryInterface = new JournalEntry({
      createDate: new Date(),
      creator: userId,
      dailyWillpower,
      bonusWillpower,
      dayEntry,
      nightEntry,
    });

    await newJournalEntry.save();

    return new NextResponse(JSON.stringify(newJournalEntry), { status: 201 });
  } catch (error) {
    console.error("Error creating new entry:", error);
    return new NextResponse("Failed to create new entry", { status: 500 });
  }
};
