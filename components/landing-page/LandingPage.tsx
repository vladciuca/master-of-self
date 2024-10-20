"use client";

import { VerticalCarousel } from "@components/VerticalCarousel";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";
import { X } from "lucide-react";

type LandingPageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
};

export function LandingPage({
  isDrawerOpen,
  handleCloseDrawer,
}: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <div
        className="absolute top-4 right-4 z-10 cursor-pointer"
        onClick={handleCloseDrawer}
      >
        <X />
      </div>
      <VerticalCarousel
      //   isDrawerOpen={isDrawerOpen}
      >
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
      </VerticalCarousel>
    </div>
  );
}
