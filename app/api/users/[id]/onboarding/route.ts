import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import { updateOnboardingStatus } from "@lib/mongo/users";
import type { Session } from "@models/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cast the session to your custom Session type
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      console.warn("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user can only update their own onboarding status
    if (session.user.id !== params.id) {
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

    const { user, error } = await updateOnboardingStatus(params.id, completed);

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
