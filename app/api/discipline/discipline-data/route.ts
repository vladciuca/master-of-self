// pages/api/discipline/info.ts
import { NextRequest, NextResponse } from "next/server";
import { getDisciplinesInfo } from "@/lib/mongo/disciplines";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "No discipline IDs provided" },
      { status: 400 }
    );
  }

  const disciplineIds = ids.split(",");
  const { infoMap, error } = await getDisciplinesInfo(disciplineIds);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(infoMap);
}
