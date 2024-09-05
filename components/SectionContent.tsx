"use client";

import { useSession } from "next-auth/react";
import PageLogo from "@components/PageLogo";
import { Layout } from "@app/types/types";

const SectionContent = ({ children }: Layout) => {
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

export default SectionContent;
