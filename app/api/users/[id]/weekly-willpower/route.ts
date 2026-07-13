import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getWeeklyWillpowerData } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userId !== routeParams.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userStartOfWeek = req.nextUrl.searchParams.get("startOfWeek");
    const userEndOfWeek = req.nextUrl.searchParams.get("endOfWeek");

    if (!userStartOfWeek || !userEndOfWeek) {
      return NextResponse.json(
        { error: "Both 'startOfWeek' and 'endOfWeek' parameters are required" },
        { status: 400 }
      );
    }

    const { weeklyWillpower, error } = await getWeeklyWillpowerData(
      userId,
      userStartOfWeek,
      userEndOfWeek
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
