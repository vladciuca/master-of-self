import { NextRequest } from "next/server";
import { connectToDB } from "@utils/database";
import JournalEntry from "@models/journalEntry";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    // Set up the current date range (00:00:00 to 23:59:59 of today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch the journal entry for the current day
    const todayEntry = await JournalEntry.findOne({
      creator: params.id,
      createDate: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate("creator");

    if (!todayEntry) {
      return new Response("No journal entry found for today", { status: 404 });
    }

    return new Response(JSON.stringify(todayEntry), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch today's journal entry", {
      status: 500,
    });
  }
};
