"use client";

import { useState, useEffect } from "react";
import {
  signIn,
  useSession,
  getProviders,
  ClientSafeProvider,
} from "next-auth/react";
import { BottomNav } from "@components/BottomNav";
import { Button } from "@components/ui/button";

type Providers = {
  [key: string]: ClientSafeProvider;
};

export function Footer() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response: any = await getProviders();
      setProviders(response as Providers);
    };

    setUpProviders();
  }, []);

  const createSignInHandler = (providerId: string) => () =>
    signIn(providerId, { callbackUrl: "/journal" });

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
        <BottomNav />
      ) : (
        providers &&
        Object.values(providers).map((provider: ClientSafeProvider) => (
          <Button
            className="w-1/2"
            type="button"
            key={provider.name}
            onClick={createSignInHandler(provider.id)}
            // disabled={status === "loading"}
          >
            Sign In
          </Button>
        ))
      )}
    </div>
  );
}
