import { connectToDB } from "@/utils/database";
import JournalEntry from "@/models/journalEntry";

export const POST = async (req, res) => {
  const { userId, createDate, gratefulItems, habitWillpower } =
    await req.json();
  try {
    await connectToDB();

    const newJournalEntry = new JournalEntry({
      createDate,
      creator: userId,
      gratefulItems,
      habitWillpower,
    });

    await newJournalEntry.save();

    return new Response(JSON.stringify(newJournalEntry), { status: 201 });
  } catch (error) {
    return new Response("Failed to create new habit", { status: 500 });
  }
};
