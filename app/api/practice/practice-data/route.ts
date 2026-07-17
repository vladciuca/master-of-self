// pages/api/practice/info.ts
import { NextRequest, NextResponse } from "next/server";
import { getPracticesInfo } from "@/lib/mongo/practices";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "No practice IDs provided" },
      { status: 400 }
    );
  }

  const practiceIds = ids.split(",");
  const { infoMap, error } = await getPracticesInfo(practiceIds);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(infoMap);
}
