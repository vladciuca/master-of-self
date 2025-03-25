import { NextRequest, NextResponse } from "next/server";
import { updateHabitsXpAndActions } from "@lib/mongo/habits";
import { HabitUpdate, HabitActionUpdate } from "@models/mongodb";

type UpdateHabitsRequestBody = {
  userId: string;
  habitXpUpdates: HabitUpdate[];
  habitActionsUpdates: HabitActionUpdate;
  updateDate: string;
};

export async function PATCH(req: NextRequest) {
  try {
    const {
      habitXpUpdates,
      habitActionsUpdates,
      updateDate,
    }: UpdateHabitsRequestBody = await req.json();

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
      // NOTE: might check after Date if it already exists to return specific error on retry
      // case "already_updated":
      //   response.message = "Habits were already updated today";
      //   return NextResponse.json(response, { status: 200 });

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
