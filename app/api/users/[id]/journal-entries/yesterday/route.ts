import { NextRequest } from "next/server";
import { connectToDB } from "@utils/database";
import JournalEntry from "@models/journalEntry";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    // Get the date from query parameters
    const dateParam = req.nextUrl.searchParams.get("date");
    if (!dateParam) {
      return new Response("Date parameter is required", { status: 400 });
    }

    // Set up the date range for yesterday (00:00:00 to 23:59:59)
    const yesterday = new Date(dateParam);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    // Fetch the journal entry for yesterday
    const yesterdayEntry = await JournalEntry.findOne({
      creator: params.id,
      createDate: {
        $gte: yesterday,
        $lt: today,
      },
    }).populate("creator");

    if (!yesterdayEntry) {
      return new Response("No journal entry found for yesterday", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(yesterdayEntry), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch yesterday's journal entry", {
      status: 500,
    });
  }
};
