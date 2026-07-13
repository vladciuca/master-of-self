import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDisciplines } from "lib/mongo/disciplines";

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

    const { disciplines, error } = await getDisciplines(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!disciplines) {
      return NextResponse.json(
        { error: "No disciplines found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ disciplines: disciplines }, { status: 200 });
  } catch (error) {
    console.error("Error fetching disciplines:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
