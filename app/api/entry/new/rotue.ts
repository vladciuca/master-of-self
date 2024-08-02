import { NextRequest } from "next/server";
import { connectToDB } from "@utils/database";
import JournalEntry, { JournalEntryType } from "@models/entry";

interface JournalEntryInput {
  userId: string;
  createDate: Date;
  willPower: number;
  dayEntry: object;
  nightEntry: object;
}

export const POST = async (req: NextRequest) => {
  const {
    userId,
    createDate,
    willPower,
    dayEntry,
    nightEntry,
  }: JournalEntryInput = await req.json();
  try {
    await connectToDB();

    const newJournalEntry: JournalEntryType = new JournalEntry({
      createDate,
      creator: userId,
      willPower,
      dayEntry,
      nightEntry,
    });

    await newJournalEntry.save();

    return new Response(JSON.stringify(newJournalEntry), { status: 201 });
  } catch (error) {
    return new Response("Failed to create new habit", { status: 500 });
  }
};
