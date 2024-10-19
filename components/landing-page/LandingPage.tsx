import { useState, useEffect } from "react";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";

type LandingPageProps = {
  isDrawerOpen: boolean;
};

export function LandingPage({ isDrawerOpen }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection isDrawerOpen={isDrawerOpen} />
      <ProblemSection isDrawerOpen={isDrawerOpen} />
      <SolutionSection isDrawerOpen={isDrawerOpen} />
    </div>
  );
}
