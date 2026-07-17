import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateActivePractices, getUser } from "lib/mongo/users";

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

    const { user, error } = await getUser(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { activePractices: user.profile.activePractices || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching active practices:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const { practiceId, action } = await request.json();

    if (!practiceId || (action !== "add" && action !== "remove")) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Required: practiceId and action (add or remove)",
        },
        { status: 400 }
      );
    }

    const result = await updateActivePractices(userId, practiceId, action);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (result.status === "no_change") {
      return NextResponse.json(
        { message: "No changes were made" },
        { status: 304 }
      );
    }

    return NextResponse.json(
      {
        message: "Active practices updated successfully",
        activePractices: result.user?.profile.activePractices || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating active practices:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
