"use client";

import JournalNav from "@components/JournalNav";
import { useSession } from "next-auth/react";

const Footer = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user ? (
        <JournalNav />
      ) : (
        <footer className="bg-primary text-white py-4 mt-4">Footer</footer>
      )}
    </>
  );
};

export default Footer;
