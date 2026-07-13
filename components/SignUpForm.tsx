"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function SignUpForm() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center p-6">
        <SignUp
          appearance={{
            options: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              footer: "hidden",
            },
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
