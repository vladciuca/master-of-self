"use client";

import { LandingPage } from "./landing-page/LandingPage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSideContent } from "@/context/SideContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SideContent() {
  const { isDrawerOpen, setIsDrawerOpen } = useSideContent();

  return (
    <>
      <ScrollArea
        className={`hidden md:block h-full bg-background rounded-tr-xl rounded-br-xl relative z-10 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "w-[65%]" : "w-0 overflow-hidden"
        }`}
      >
        <div
          className={`h-full transition-opacity duration-100 ease-in-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <LandingPage isDrawerOpen={isDrawerOpen} />
        </div>
      </ScrollArea>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4 z-50 md:flex hidden"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        {isDrawerOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </>
  );
}
