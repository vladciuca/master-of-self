"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeroSection } from "./sections/HeroSection";
import { IntroductionSection } from "./sections/IntroductionSection";
import { CardsSection } from "./sections/CardsSection";
import { ScienceSection } from "./sections/ScienceSection";
import { MindsetBehaviorSection } from "./sections/MindsetBehaviorSection";
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
};

export function LandingPage({
  isDrawerOpen,
  handleCloseDrawer,
}: LandingPageProps) {
  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <div
            className="absolute top-4 right-4 z-10 cursor-pointer"
            onClick={handleCloseDrawer}
          >
            <X />
          </div>
          <motion.div
            className="h-full flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sectionVariants}
            transition={{ duration: 0.3 }}
          >
            <ScrollArea className="flex-grow">
              <main className="min-h-screen px-6 py-12">
                <HeroSection />
                <IntroductionSection />
                <CardsSection />
                <ScienceSection />
                <MindsetBehaviorSection />
              </main>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
