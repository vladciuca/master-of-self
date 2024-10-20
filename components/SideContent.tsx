"use client";

import { LandingPage } from "./landing-page/LandingPage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSideContent } from "@/context/SideContentContext";

export function SideContent() {
  const { isDrawerOpen, setIsDrawerOpen } = useSideContent();

  return (
    <>
      <div
        className={`hidden lg:block h-full bg-background rounded-tr-xl rounded-br-xl relative z-20 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "w-[100%]" : "w-0 overflow-hidden"
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
      {!isDrawerOpen && (
        <Button
          variant="secondary"
          size="icon"
          className="z-50 absolute top-4 left-4 lg:flex hidden w-32 transition-all duration-300 ease-in-out"
          // className={`absolute top-4 ${
          //   isDrawerOpen ? "left-20" : "left-4"
          // } z-50 md:flex hidden`}

          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          {"Vision"} {isDrawerOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      )}
    </>
  );
}
