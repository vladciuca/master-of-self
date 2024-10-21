"use client";

import { LandingPage } from "./landing-page/LandingPage";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";
import { useSideContent } from "@/context/SideContentContext";

export function SideContent() {
  const { isDrawerOpen, setIsDrawerOpen } = useSideContent();

  return (
    <>
      <div
        className={`relative hidden lg:block h-full bg-background rounded-tr-xl rounded-br-xl transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "w-[80%]" : "w-0 overflow-hidden"
        }`}
      >
        <div
          className={`z-20 h-full transition-opacity duration-100 ease-in-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <LandingPage
            isDrawerOpen={isDrawerOpen}
            handleCloseDrawer={() => setIsDrawerOpen(false)}
          />
        </div>
      </div>
      <Button
        variant={`${!isDrawerOpen ? "outline" : "default"}`}
        size="lg"
        className={`py-6 ${
          isDrawerOpen ? "left-[45.5%] px-2" : "left-4 px-4"
        } absolute top-4 z-50 lg:flex hidden transition-all duration-300 ease-in-out`}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <FaEye className="text-4xl" />
        {!isDrawerOpen ? <span className="mx-2">{"Vision"}</span> : <></>}
      </Button>
    </>
  );
}
