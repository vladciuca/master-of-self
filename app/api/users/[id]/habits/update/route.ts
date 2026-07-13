import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateHabitsXpAndActions } from "@lib/mongo/habits";
import { HabitUpdate, HabitActionUpdate } from "@models/mongodb";

export async function PATCH(
  req: NextRequest,
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

    const {
      habitXpUpdates,
      habitActionsUpdates,
      updateDate,
    }: {
      habitXpUpdates: HabitUpdate[];
      habitActionsUpdates: HabitActionUpdate;
      updateDate: string;
    } = await req.json();

    if (!habitXpUpdates || !habitActionsUpdates || !updateDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { updatedHabits, status, error } = await updateHabitsXpAndActions(
      habitXpUpdates,
      habitActionsUpdates,
      updateDate
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const response = {
      habits: updatedHabits,
      message: "",
    };

    switch (status) {
      case "no_change":
        response.message = "No updates were needed";
        return NextResponse.json(response, { status: 200 });

      case "success":
        response.message = "Successfully updated habits";
        return NextResponse.json(response, { status: 200 });

      default:
        return NextResponse.json(
          { error: "Unknown status returned" },
          { status: 500 }
        );
    }
  } catch (error) {
    console.error("Error updating habits:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
