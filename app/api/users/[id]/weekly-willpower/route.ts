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
    // const dateParam = req.nextUrl.searchParams.get("date");
    // if (!dateParam) {
    //   return new Response("Date parameter is required", { status: 400 });
    // }

    // Parse the date parameter
    const clientDate = new Date();

    if (isNaN(clientDate.getTime())) {
      return new Response("Invalid date provided", { status: 400 });
    }

    // Calculate the start of the week (Monday) based on the client date
    const startOfWeek = new Date(clientDate);
    startOfWeek.setDate(clientDate.getDate() - ((clientDate.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const journalEntries = await JournalEntry.find({
      creator: params.id,
      createDate: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    }).sort({ createDate: 1 });

    // Create an array of all days in the week (Monday to Sunday)
    const allDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day.toISOString().split("T")[0];
    });

    // Create a map of existing entries
    const entriesMap = new Map(
      journalEntries.map((entry) => [
        entry.createDate.toISOString().split("T")[0],
        {
          generatedWillpower:
            (entry.dailyWillpower as number) - (entry.bonusWillpower as number),
          bonusWillpower: entry.bonusWillpower,
        },
      ])
    );

    // Process the data for the chart, including all days
    const weeklyWillpower = allDays.map((dateString) => {
      const entry = entriesMap.get(dateString) || {
        generatedWillpower: 0,
        bonusWillpower: 0,
      };
      return {
        date: dateString,
        generatedWillpower: entry.generatedWillpower,
        bonusWillpower: entry.bonusWillpower,
      };
    });

    return new Response(JSON.stringify(weeklyWillpower), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch weekly willpower data", {
      status: 500,
    });
  }
};
