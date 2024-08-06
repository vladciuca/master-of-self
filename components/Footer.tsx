"use client";

import { useState, useEffect } from "react";
import {
  signIn,
  useSession,
  getProviders,
  ClientSafeProvider,
} from "next-auth/react";
import JournalNav from "@components/JournalNav";
import { Button } from "./ui/button";

interface Providers {
  [key: string]: ClientSafeProvider;
}

const Footer: React.FC = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response: any = await getProviders();
      setProviders(response as Providers);
    };

    setUpProviders();
  }, []);

  const createSignInHandler = (providerId: string) => () => signIn(providerId);

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
        Object.values(providers).map((provider: ClientSafeProvider) => (
          <Button
            className="w-1/2"
            type="button"
            key={provider.name}
            onClick={createSignInHandler(provider.id)}
          >
            Sign In
          </Button>
        ))
      )}
    </div>
  );
};

export default Footer;
