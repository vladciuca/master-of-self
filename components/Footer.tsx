"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@components/BottomNav";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { useUserSettings } from "@context/UserSettingsContext";

export function Footer() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { userSettings } = useUserSettings();

  console.log("Footer rendering with userSettings:", userSettings);

  const renderFooterComponent = () => {
    if (pathname === "/") {
      return (
        <Button className="w-1/2">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      );
    } else {
      if (status === "loading") {
        return (
          <div className="w-full h-full flex justify-center items-center">
            <div className="loader" />
          </div>
        );
      } else {
        return (
          <Button className="w-1/2" variant="secondary">
            <Link href="/">Cancel</Link>
          </Button>
        );
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {session?.user ? <BottomNav /> : renderFooterComponent()}
    </div>
  );
}
