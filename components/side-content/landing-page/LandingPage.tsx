"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeroSection } from "./sections/HeroSection";
import { IntroductionSection } from "./sections/IntroductionSection";
import { CardsSection } from "./sections/CardsSection";
// import { ScienceSection } from "../how-it-works/sections/ScienceSection";
// import { MindsetBehaviorSection } from "../how-it-works/sections/MindsetBehaviorSection";
import { X } from "lucide-react";

export const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { opacity: { delay: 0.2 }, duration: 0.8 },
  },
  exit: { opacity: 0, y: 50 },
};

type LandingPageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
  isMobile?: boolean;
};

export function LandingPage({
  isDrawerOpen,
  handleCloseDrawer,
  isMobile = false,
}: LandingPageProps) {
  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {!isMobile && (
            <div
              className="absolute top-4 right-4 z-10 cursor-pointer"
              onClick={handleCloseDrawer}
            >
              <X />
            </div>
          )}

          <motion.div
            className="h-full flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sectionVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-grow overflow-scroll">
              <main
                className={`min-h-screen ${
                  isMobile ? "p-0 pb-6" : "px-6 py-12"
                }`}
              >
                <HeroSection />
                {/* <IntroductionSection /> */}
                <CardsSection />
              </main>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
