"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { SignInHero } from "@components/SignInHero";

export function ProviderSignIn() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end p-6">
      <SignInHero className="absolute inset-0 z-0" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <SignIn
          appearance={{
            options: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full bg-transparent shadow-none border-none px-3",
              card: "bg-transparent shadow-none border-none px-3",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              footer: "hidden",
            },
          }}
        />
        <div className="mt-4 text-sm text-white/80">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-white underline underline-offset-4 hover:text-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
