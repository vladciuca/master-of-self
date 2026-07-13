import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateOnboardingStatus } from "@lib/mongo/users";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      console.warn("No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userId !== routeParams.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { completed } = body;

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid completed value" },
        { status: 400 }
      );
    }

    const { user, error } = await updateOnboardingStatus(userId, completed);

    if (error || !user) {
      return NextResponse.json(
        { error: error || "Failed to update onboarding status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      onboardingCompleted: user.profile?.onboardingCompleted,
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
