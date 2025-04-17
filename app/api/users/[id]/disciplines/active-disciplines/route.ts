import { NextRequest, NextResponse } from "next/server";
import { updateActiveDisciplines, getUser } from "lib/mongo/users";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { user, error } = await getUser(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { activeDisciplines: user.profile.activeDisciplines || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching active disciplines:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { disciplineId, action } = await request.json();

    if (!disciplineId || (action !== "add" && action !== "remove")) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Required: disciplineId and action (add or remove)",
        },
        { status: 400 }
      );
    }

    const result = await updateActiveDisciplines(userId, disciplineId, action);

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
        message: "Active disciplines updated successfully",
        activeDisciplines: result.user?.profile.activeDisciplines || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating active disciplines:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
