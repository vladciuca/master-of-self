"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/journal");
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Sign In
          </h1>
        </CardTitle>
        <CardDescription>
          Enter your credentials or use a provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button
            variant="outline"
            className="w-full mt-4 hover:bg-primary hover:text-primary-foreground"
            type="submit"
          >
            Sign In
          </Button>
        </form>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-2">
          <Button
            variant="default"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Sign in with Google
          </Button>
          {/* Add more provider buttons here as needed */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center mt-8">
        <div className="text-sm flex justify-between items-center w-full">
          Don't have an account?
          <Button size="sm" className="ml-6">
            <Link href="/sign-up" className="hover:underline">
              Sign Up
            </Link>
          </Button>
        </div>
      </CardFooter>
    </div>
  );
}
