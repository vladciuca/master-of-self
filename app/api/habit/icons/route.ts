import { NextRequest, NextResponse } from "next/server";
import { getHabitsIcons } from "@/lib/mongo/habits";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "No habit IDs provided" },
      { status: 400 }
    );
  }

  const habitIds = ids.split(",");
  const { iconMap, error } = await getHabitsIcons(habitIds);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(iconMap);
}
