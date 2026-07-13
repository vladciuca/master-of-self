"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { SignInHero } from "@components/SignInHero";

export function SignUpForm() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end p-6">
      <SignInHero className="absolute inset-0 z-0" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <SignUp
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
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
