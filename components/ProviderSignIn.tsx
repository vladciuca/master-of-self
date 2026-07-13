"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { SignInHero } from "@components/SignInHero";
import { ClerkAuthSkeleton } from "@components/clerk/ClerkAuthSkeleton";

export function ProviderSignIn() {
  return (
    <div className="h-full w-full flex flex-col py-1 overflow-hidden">
      <SignInHero className="flex-1 min-h-0" />
      <div className="w-full flex flex-col items-center flex-shrink-0">
        <SignIn
          fallback={<ClerkAuthSkeleton />}
          appearance={{
            options: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full bg-transparent shadow-none border-none px-3 py-2",
              card: "bg-transparent shadow-none border-none px-3 py-2",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              footer: "hidden",
            },
          }}
        />
        <div className="my-2 text-sm text-white/80">
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
