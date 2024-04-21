"use client";

import JournalNav from "@components/JournalNav";
import { useState, useEffect } from "react";
import { signIn, useSession, getProviders } from "next-auth/react";
import { Button } from "./ui/button";

const Footer = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    setUpProviders();
  }, []);

  if (status === "loading" || !providers) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {session?.user ? (
        <JournalNav />
      ) : (
        providers &&
        Object.values(providers).map((provider) => (
          <Button
            className="w-1/2"
            type="button"
            key={provider.name}
            onClick={() => signIn(provider.id)}
          >
            Sign In
          </Button>
        ))
      )}
    </div>
  );
};

export default Footer;
