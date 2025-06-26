"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { UserLevel } from "@components/profile/user-level/UserLevel";
import { HeaderTitle } from "@components/HeaderTitle";
import { Session } from "@models/types";
//NOTE!
//TEMP LOADING SOLUTION for using userProfileLoading() to sync loading states
//CON: this slows for loading state for loggin in, since its only needed 1x time on a new account
//pattern repeated 3x times in Header, Footer, PageContent
import { useUserProfile } from "@context/UserProfileContext";

export function Header() {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: string;
  };
  const { userProfile, userProfileLoading } = useUserProfile();
  const pathname = usePathname();

  // Shared loading condition - same as PageContent
  const shouldShowLoading = () => {
    // Show loading during session loading
    if (status === "loading") return true;

    // Show loading if authenticated but profile is still loading
    if (status === "authenticated" && userProfileLoading) return true;

    // Show loading if authenticated, profile loaded, but we're about to redirect
    if (
      status === "authenticated" &&
      session?.user &&
      !userProfileLoading &&
      userProfile
    ) {
      // Show loading if user needs onboarding but isn't on onboarding page yet
      if (!userProfile.onboardingCompleted && pathname !== "/create-profile") {
        return true;
      }
      // Show loading if user completed onboarding but is still on onboarding page
      if (userProfile.onboardingCompleted && pathname === "/create-profile") {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="w-full">
      {shouldShowLoading() ? (
        <HeaderTitle />
      ) : session?.user ? (
        <UserLevel session={session} />
      ) : (
        <HeaderTitle />
      )}
    </div>
  );
}
