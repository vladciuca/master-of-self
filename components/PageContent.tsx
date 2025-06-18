"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SignUpPage from "@app/(full)/sign-up/page";
import SignInPage from "@app/(full)/sign-in/page";
import { PageLogo } from "@components/PageLogo";
import { MobileSideContent } from "components/side-content/MobileSideContent";
import { useScreenSize } from "@/hooks/useScreenSize";
import type { Layout } from "@models/types";

export function PageContent({ children }: Layout) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLargeScreen = useScreenSize();

  const renderPageComponent = () => {
    if (pathname === "/sign-up") {
      return <SignUpPage />;
    } else if (pathname === "/sign-in") {
      return <SignInPage />;
    } else {
      return isLargeScreen ? <PageLogo /> : <MobileSideContent />;
    }
  };

  return (
    <section className="h-full w-full">
      {status === "loading" ? (
        // Show PageLogo while loading
        <PageLogo />
      ) : session?.user ? (
        // Show main content when authenticated
        <main className="h-full w-full">{children}</main>
      ) : (
        // Show sign-in/sign-up or landing content when not authenticated
        renderPageComponent()
      )}
    </section>
  );
}
