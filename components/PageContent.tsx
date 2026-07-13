"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SignUpPage from "@app/(full)/sign-up/page";
import SignInPage from "@app/(full)/sign-in/page";
import { PageLogo } from "@components/PageLogo";
import { LoadingPageLogo } from "@components/LoadingPageLogo";
import { PageCarousel } from "@components/PageCarousel";
import { MobileSideContent } from "components/side-content/MobileSideContent";
import { useScreenSize } from "@/hooks/useScreenSize";
import type { Layout } from "@models/types";
//NOTE!
//TEMP LOADING SOLUTION for useUserProfile() to sync loading states
//CON: this slows for loading state for loggin in, since its only needed 1x time on a new account
//pattern repeated 3x times in Header, Footer, PageContent
import { useUserProfile } from "@context/UserProfileContext";

export function PageContent({ children }: Layout) {
  const { user, isLoaded } = useUser();
  const { userProfile, userProfileLoading } = useUserProfile();
  const pathname = usePathname();
  const router = useRouter();
  const isLargeScreen = useScreenSize();

  const carouselImages = [
    "/assets/landing-page/1.png",
    "/assets/landing-page/2.png",
    "/assets/landing-page/3.png",
  ];

  // Handle onboarding redirection
  useEffect(() => {
    if (
      user &&
      !userProfileLoading &&
      userProfile
    ) {
      // If user hasn't completed onboarding and is not on the onboarding page
      if (!userProfile.onboardingCompleted && pathname !== "/create-profile") {
        router.push("/create-profile");
      }
      // If user has completed onboarding and tries to access onboarding page
      else if (
        userProfile.onboardingCompleted &&
        pathname === "/create-profile"
      ) {
        router.push("/journal");
      }
    }
  }, [user, userProfile, userProfileLoading, pathname, router]);

  // Determine if we should show loading
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

  const renderPageComponent = () => {
    if (pathname === "/sign-up" || pathname.startsWith("/sign-up/")) {
      return <SignUpPage />;
    } else if (pathname === "/sign-in" || pathname.startsWith("/sign-in/")) {
      return <SignInPage />;
    } else {
      return isLargeScreen ? (
        // <PageCarousel
        //   images={carouselImages}
        //   autoPlayInterval={4000}
        //   showDots={true}
        // />
        <PageLogo />
      ) : (
        <MobileSideContent />
      );
    }
  };

  return (
    <section className="h-full w-full">
      {shouldShowLoading() ? (
        <LoadingPageLogo />
      ) : user ? (
        // Show main content when authenticated and ready
        <main className="h-full w-full px-4">{children}</main>
      ) : (
        // Show sign-in/sign-up or landing content when not authenticated
        renderPageComponent()
      )}
    </section>
  );
}
