import { NextRequest, NextResponse } from "next/server";
import { updateUserDisciplinesValues } from "@lib/mongo/users";
import type { UserDisciplines } from "@models/types";

type UpdateDisciplinesRequestBody = {
  userId: string;
  disciplines: UserDisciplines;
};

export async function PATCH(req: NextRequest) {
  try {
    const { userId, disciplines }: UpdateDisciplinesRequestBody =
      await req.json();

    if (!userId || !disciplines) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate that at least one discipline is being updated
    if (Object.keys(disciplines).length === 0) {
      return NextResponse.json(
        { error: "No disciplines provided for update" },
        { status: 400 }
      );
    }

    const { user, status, error } = await updateUserDisciplinesValues(
      userId,
      disciplines
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const response = {
      user,
      message: "",
    };

    switch (status) {
      case "no_change":
        response.message = "No changes were made to disciplines";
        return NextResponse.json(response, { status: 200 });

      case "success":
        response.message = "Successfully updated disciplines";
        return NextResponse.json(response, { status: 200 });

      default:
        return NextResponse.json(
          { error: "Unknown status returned" },
          { status: 500 }
        );
    }
  } catch (error) {
    console.error("Error updating disciplines:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
