import { connectToDB } from "@utils/database";
import JournalEntry from "@models/journalEntry";

export const POST = async (req, res) => {
  const { userId, gratefulItems } = await req.json();
  try {
    await connectToDB();
    const newJournalEntry = new JournalEntry({
      creator: userId,
      gratefulItems,
    });

    await newJournalEntry.save();

    return new Response(JSON.stringify(newJournalEntry), { status: 201 });
  } catch (error) {
    return new Response("Failed to create new habit", { status: 500 });
  }
};
