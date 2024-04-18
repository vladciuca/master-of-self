"use client";

import JournalNav from "@components/JournalNav";
import { useState, useEffect } from "react";
import { signIn, useSession, getProviders } from "next-auth/react";
import { Button } from "./ui/button";

const Footer = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <>
      {session?.user ? (
        <JournalNav />
      ) : (
        <footer className="w-full h-full flex justify-center items-center">
          {providers &&
            Object.values(providers).map((provider) => (
              <Button
                className="w-1/2"
                type="button"
                key={provider.name}
                onClick={() => signIn(provider.id)}
              >
                Sign In
              </Button>
            ))}
        </footer>
      )}
    </>
  );
};

export default Footer;
