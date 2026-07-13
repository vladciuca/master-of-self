"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { UserLevel } from "@components/profile/user-level/UserLevel";
import { HeaderTitle } from "@components/HeaderTitle";
import { User } from "@models/types";
//NOTE!
//TEMP LOADING SOLUTION for using userProfileLoading() to sync loading states
//CON: this slows for loading state for loggin in, since its only needed 1x time on a new account
//pattern repeated 3x times in Header, Footer, PageContent
import { useUserProfile } from "@context/UserProfileContext";

export function Header() {
  const { user, isLoaded } = useUser() as { user: User | null; isLoaded: boolean };
  const { userProfile, userProfileLoading } = useUserProfile();
  const pathname = usePathname();

  // Shared loading condition - same as PageContent
  const shouldShowLoading = () => {
    // Show loading during user loading
    if (!isLoaded) return true;

    // Show loading if signed in but profile is still loading
    if (user && userProfileLoading) return true;

    // Show loading if signed in, profile loaded, but we're about to redirect
    if (
      user &&
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
      ) : user ? (
        <UserLevel user={user} />
      ) : (
        <HeaderTitle />
      )}
    </div>
  );
}
