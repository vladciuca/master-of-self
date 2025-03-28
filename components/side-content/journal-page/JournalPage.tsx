import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "./HeroSection";
import { JournalStepsSection } from "./JournalStepsSection";
import { JournalEntriesSection } from "./JournalEntriesSection";
import { DisciplineScoresSection } from "./DisciplineScoresSection";
import { ScrollArea } from "@components/ui/scroll-area";
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

type JournalPageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
};

export function JournalPage({
  isDrawerOpen,
  handleCloseDrawer,
}: JournalPageProps) {
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
                <JournalStepsSection />
                <JournalEntriesSection />
                <DisciplineScoresSection />
              </main>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
