"use client";

import { useSession } from "next-auth/react";
import Profile from "@components/Profile";
import HeaderTitle from "@components/HeaderTitle";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 w-full z-50 h-20">
      {session?.user ? <Profile session={session} /> : <HeaderTitle />}
    </div>
  );
};

export default Header;
