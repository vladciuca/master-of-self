import { NextRequest, NextResponse } from "next/server";
import { getAllDisciplinesExceptUser } from "@lib/mongo/disciplines";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@lib/authOptions";

//NOTE:MIGHT NEED TO MOVE THIS to /users/[id]?
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current user's session
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { disciplines, error } = await getAllDisciplinesExceptUser(userId);

    if (error || !disciplines) {
      return NextResponse.json(
        { error: error || "Failed to fetch disciplines" },
        { status: 500 }
      );
    }

    return NextResponse.json({ disciplines });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
