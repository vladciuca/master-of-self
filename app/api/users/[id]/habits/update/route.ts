// import { NextRequest, NextResponse } from "next/server";
// import { updateHabitsXpAndActions } from "@lib/mongo/habits";

// export async function PATCH(req: NextRequest) {
//   const { userId, habitXpUpdates, habitActionsUpdates, updateDate } =
//     await req.json();

//   try {
//     const { updatedHabits, status } = await updateHabitsXpAndActions(
//       userId,
//       habitXpUpdates,
//       habitActionsUpdates,
//       updateDate
//     );

//     switch (status) {
//       case "already_updated":
//         return NextResponse.json(
//           {
//             habits: updatedHabits,
//             message: "Habits were already updated today",
//           },
//           { status: 200 }
//         );

//       case "no_updates_needed":
//         return NextResponse.json(
//           {
//             habits: updatedHabits,
//             message: "No updates were needed",
//           },
//           { status: 200 }
//         );

//       case "success":
//         return NextResponse.json(
//           {
//             habits: updatedHabits,
//             message: "Successfully updated habits",
//           },
//           { status: 200 }
//         );

//       default:
//         return NextResponse.json(
//           {
//             error: "Unknown status returned",
//           },
//           { status: 500 }
//         );
//     }
//   } catch (error) {
//     console.error("Error updating habit:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { updateHabitsXpAndActions } from "@lib/mongo/habits";
import { HabitUpdate, HabitActionUpdate } from "@app/types/mongodb";

type UpdateHabitsRequestBody = {
  userId: string;
  habitXpUpdates: HabitUpdate[];
  habitActionsUpdates: HabitActionUpdate;
  updateDate: string;
};

export async function PATCH(req: NextRequest) {
  try {
    const {
      userId,
      habitXpUpdates,
      habitActionsUpdates,
      updateDate,
    }: UpdateHabitsRequestBody = await req.json();

    if (!userId || !habitXpUpdates || !habitActionsUpdates || !updateDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { updatedHabits, status } = await updateHabitsXpAndActions(
      userId,
      habitXpUpdates,
      habitActionsUpdates,
      updateDate
    );

    const response = {
      habits: updatedHabits,
      message: "",
    };

    switch (status) {
      case "already_updated":
        response.message = "Habits were already updated today";
        return NextResponse.json(response, { status: 200 });

      case "no_updates_needed":
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
