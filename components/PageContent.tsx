"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SignUpPage from "@app/(full)/sign-up/page";
import SignInPage from "@app/(full)/sign-in/page";
import { PageLogo } from "@components/PageLogo";
import { Layout } from "@app/types/types";

export function PageContent({ children }: Layout) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const renderPageComponent = () => {
    if (pathname === "/sign-up") {
      return <SignUpPage />;
    } else if (pathname === "/sign-in") {
      return <SignInPage />;
    } else {
      return <PageLogo />;
    }
  };

  return (
    <section className="h-full w-full">
      {session?.user ? (
        <main className="h-full w-full">{children}</main>
      ) : (
        renderPageComponent()
      )}
    </section>
  );
}
