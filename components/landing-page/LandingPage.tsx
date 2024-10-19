import { useState, useEffect } from "react";
import { HeroSection } from "./HeroSection";
import { CopySection } from "./CopySection";

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
      <CopySection isDrawerOpen={isDrawerOpen} />
    </div>
  );
}
