"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
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

type PageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
};

export function CTAPage({ isDrawerOpen, handleCloseDrawer }: PageProps) {
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
          {/* <motion.div
            className="h-full flex items-center justify-center"
            style={{ height: "100vh" }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sectionVariants}
            transition={{ duration: 0.3 }}
          >
            <ScrollArea className="flex-grow h-full">
              <main className="min-h-full px-6 py-12 pt-40">
                <div className="h-full w-full flex flex-col items-center justify-center space-y-12 max-w-2xl px-6 mx-auto">
                  <h1 className="text-5xl md:text-6xl font-bold leading-loose text-primary bg-clip-text text-center">
                    What do 👉 you put in your head ?
                  </h1>

                  <span>
                    <p className="text-lg md:text-xl text-muted-foreground font-light text-center px-12">
                      Create daily prompts, track your growth, and discover how
                      others stay disciplined — all in one shared journaling
                      space.
                    </p>
                    <p className="text-lg md:text-xl text-muted-foreground font-light text-center pt-6 pb-12 px-12">
                      The questions shape you. The answers fuel you. Start
                      writing.
                    </p>
                  </span>

                  <Link href="/sign-in">
                    <button className="flex items-center justify-center font-semibold py-5 px-10 rounded-full text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white bg-[linear-gradient(to_right,_#fbbe25_50%,_#8a5cf7_50%)]">
                      Build My Discipline
                      <svg
                        className="ml-2"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </main>
            </ScrollArea>
          </motion.div> */}
          <motion.div
            className="h-full grid place-items-center"
            style={{ height: "100vh" }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sectionVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full max-w-2xl px-6 mx-auto space-y-16 text-center">
              <h1 className="text-5xl md:text-6xl font-bold leading-loose text-primary bg-clip-text">
                What do 👉 you put in your head ?
              </h1>

              <div className="space-y-6">
                <p className="text-lg md:text-xl text-muted-foreground font-light px-12">
                  Create daily prompts, track your growth, and discover how
                  others stay disciplined — all in one shared journaling space.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground font-light px-12">
                  The questions shape you. The answers fuel you. Start writing.
                </p>
              </div>

              <div>
                <Link href="/sign-in">
                  <button className="flex items-center justify-center font-semibold py-5 px-10 rounded-full text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white bg-[linear-gradient(to_right,_#fbbe25_50%,_#8a5cf7_50%)] mx-auto">
                    Build My Discipline
                    <svg
                      className="ml-2"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
