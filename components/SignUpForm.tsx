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

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        // Sign in the user after successful sign up
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
      } else {
        const data = await res.json();
        setError(data.message || "An error occurred during sign up");
      }
    } catch (error) {
      setError("An error occurred during sign up");
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Sign Up
          </h1>
        </CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
          <Button className="w-full mt-4" type="submit">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center mt-8">
        <div className="text-sm flex justify-between items-center w-full">
          Already have an account?
          <Button size="sm" className="ml-6">
            <Link href="/sign-in" className="hover:underline">
              Sign In
            </Link>
          </Button>
        </div>
        {/* <Button variant="secondary" size="sm" className="w-full">
          <Link href="/">Cancel</Link>
        </Button> */}
      </CardFooter>
    </div>
  );
}
