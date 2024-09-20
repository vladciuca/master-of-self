import { NextRequest } from "next/server";
import { connectToDB } from "@lib/database";
import JournalEntry from "@models/journalEntry";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const journalEntries = await JournalEntry.find({
      creator: params.id,
    }).populate("creator");

    return new Response(JSON.stringify(journalEntries), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all habits", { status: 500 });
  }
};
