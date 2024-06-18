import { connectToDB } from "@/utils/database";
import JournalEntry from "@/models/journalEntry";

export const GET = async (req) => {
  try {
    await connectToDB();

    const journalEntries = await JournalEntry.find({}).populate("creator");

    return new Response(JSON.stringify(journalEntries), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all habits", { status: 500 });
  }
};
