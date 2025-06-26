"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNav } from "@components/BottomNav";
import { Button } from "@components/ui/button";
//NOTE!
//TEMP LOADING SOLUTION for using userProfileLoading() to sync loading states
//CON: this slows for loading state for loggin in, since its only needed 1x time on a new account
//pattern repeated 3x times in Header, Footer, PageContent
import { useUserProfile } from "@context/UserProfileContext";

export function Footer() {
  const { data: session, status } = useSession();
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
    const isAuthPage = pathname === "/sign-in";
    // || pathname === "/sign-up"
    if (status === "unauthenticated" && !isAuthPage) {
      router.push("/");
    }
  }, [status, pathname, router]);

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

  if (shouldShowLoading()) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="loader" />
      </div>
    );
  }

  if (session?.user) {
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
