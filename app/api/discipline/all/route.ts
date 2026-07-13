import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllDisciplinesExceptUser } from "@lib/mongo/disciplines";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { disciplines, error } = await getAllDisciplinesExceptUser(userId);

    if (error || !disciplines) {
      return NextResponse.json(
        { error: error || "Failed to fetch disciplines" },
        { status: 500 }
      );
    }

    return NextResponse.json({ disciplines });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
