"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { GiAllSeeingEye } from "react-icons/gi";

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
        <div className="h-full flex items-center justify-center">
          <GiAllSeeingEye size={"20rem"} />
        </div>
      )}
    </section>
  );
};

export default LandingPage;
