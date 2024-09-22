import { NextRequest, NextResponse } from "next/server";
import { getHabits } from "lib/mongo/habits";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
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
