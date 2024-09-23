import { NextRequest, NextResponse } from "next/server";
import { getWeeklyWillpowerData } from "@lib/mongo/journal-entries"; // Update this import path as needed
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const startOfWeek = req.nextUrl.searchParams.get("startOfWeek");
    const endOfWeek = req.nextUrl.searchParams.get("endOfWeek");

    if (!startOfWeek || !endOfWeek) {
      return NextResponse.json({ error: "No date provided" }, { status: 400 });
    }

    const startOfWeekDate = startOfWeek ? new Date(startOfWeek) : new Date();
    const endOfWeekDate = endOfWeek ? new Date(endOfWeek) : new Date();

    if (isNaN(startOfWeekDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date provided" },
        { status: 400 }
      );
    }

    const { weeklyWillpower, error } = await getWeeklyWillpowerData(
      params.id,
      startOfWeekDate.toISOString(),
      endOfWeekDate.toISOString()
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(weeklyWillpower);
  } catch (error) {
    console.error("Error in weekly willpower route:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly willpower data" },
      { status: 500 }
    );
  }
}
