import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateUserDisciplinesValues } from "@lib/mongo/users";
import type { UserDisciplines } from "@models/types";

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

    const { disciplines }: { disciplines: UserDisciplines } = await req.json();

    if (!disciplines) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
