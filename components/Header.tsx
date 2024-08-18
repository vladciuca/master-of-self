"use client";

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";

const HeaderTitle = () => (
  <div className="w-full h-full flex justify-center items-center">
    <h1 className="text-4xl uppercase tracking-wider font-semibold">
      <span className="text-6xl font-normal">M</span>aster of{" "}
      <span className="text-6xl font-normal">S</span>elf
    </h1>
  </div>
);

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 w-full z-50 h-20">
      {session?.user ? <Profile session={session} /> : <HeaderTitle />}
    </div>
  );
};

export default Header;
