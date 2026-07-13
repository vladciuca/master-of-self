import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getHabits } from "lib/mongo/habits";

export async function GET(
  request: NextRequest,
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

    const { habits, error } = await getHabits(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!habits) {
      return NextResponse.json({ error: "No habits found" }, { status: 404 });
    }

    return NextResponse.json({ habits: habits }, { status: 200 });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
