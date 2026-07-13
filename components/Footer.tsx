"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { BottomNav } from "@components/BottomNav";
import { Button } from "@components/ui/button";
//NOTE!
//TEMP LOADING SOLUTION for using userProfileLoading() to sync loading states
//CON: this slows for loading state for loggin in, since its only needed 1x time on a new account
//pattern repeated 3x times in Header, Footer, PageContent
import { useUserProfile } from "@context/UserProfileContext";

export function Footer() {
  const { user, isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleCancel = () => {
    router.push("/");
  };

  // Redirect unauthenticated users to `/` if not on `/sign-in` or `/sign-up`
  useEffect(() => {
    const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
    if (isLoaded && isSignedIn === false && !isAuthPage) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, pathname, router]);

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

  if (shouldShowLoading()) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="loader" />
      </div>
    );
  }

  if (user) {
    return (
      <BottomNav
        userProfile={userProfile}
        userProfileError={userProfileError}
      />
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {pathname === "/" ? (
        <Button className="w-1/2" onClick={handleSignIn}>
          Sign In
        </Button>
      ) : (
        <Button className="w-1/2" variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}
