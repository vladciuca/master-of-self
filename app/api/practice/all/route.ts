import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllPractices } from "@lib/mongo/practices";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { practices, error } = await getAllPractices();

    if (error || !practices) {
      return NextResponse.json(
        { error: error || "Failed to fetch practices" },
        { status: 500 }
      );
    }

    return NextResponse.json({ practices });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
