"use client";

import Stats from "@components/Stats";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 w-full z-50 h-24">
      {session?.user ? (
        <Stats session={session} />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-4xl uppercase tracking-wider font-semibold">
            <span className="text-6xl font-normal">M</span>aster of{" "}
            <span className="text-6xl font-normal">S</span>elf
          </h1>
        </div>
      )}
    </div>
  );
};

export default Header;
