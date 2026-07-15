import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPractices } from "lib/mongo/practices";

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

    const { practices, error } = await getPractices(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!practices) {
      return NextResponse.json(
        { error: "No practices found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ practices: practices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching practices:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
