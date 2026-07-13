"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { SignInHero } from "@components/SignInHero";

export function SignUpForm() {
  return (
    <div className="h-full w-full flex flex-col py-1 overflow-hidden">
      <SignInHero className="flex-1 min-h-0" />
      <div className="w-full flex flex-col items-center flex-shrink-0">
        <SignUp
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
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-white underline underline-offset-4 hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
