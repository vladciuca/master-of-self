"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import PageLogo from "@components/PageLogo";

interface RootLayoutProps {
  children: ReactNode;
}

const LandingPage = ({ children }: RootLayoutProps) => {
  const { data: session } = useSession();

  return (
    <section className="h-full w-full">
      {session?.user ? (
        <main className="h-full w-full">{children}</main>
      ) : (
        <PageLogo />
      )}
    </section>
  );
};

export default LandingPage;
