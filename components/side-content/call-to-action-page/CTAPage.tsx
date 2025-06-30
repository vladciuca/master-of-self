"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa6";

export const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { opacity: { delay: 0.2 }, duration: 0.8 },
  },
  exit: { opacity: 0, y: 50 },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

type PageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
  isMobile?: boolean;
};

export function CTAPage({
  isDrawerOpen,
  handleCloseDrawer,
  isMobile = false,
}: PageProps) {
  const ContentComponent = () => (
    <motion.div
      className="w-full max-w-4xl mx-auto text-center space-y-4 pt-16 sm:pt-0"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {/* Main Headline */}
      <motion.div variants={fadeInUp}>
        {/*HERO*/}
        <motion.h1
          variants={fadeInUp}
          className="py-8 text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tight"
        >
          <span className="block text-3xl md:text-4xl lg:text-5xl">
            "You Become What
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500">
            You Think."
          </span>

          <span className="font-medium block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 text-muted-foreground">
            — Marcus Aurelius
          </span>
        </motion.h1>

        <motion.div variants={fadeInUp} className="w-full flex justify-center">
          <div className="max-w-md mt-4">
            <h1 className="text-3xl sm:text-4xl font-semibold text-primary pt-4">
              <span className="font-medium text-4xl sm:text-5xl">P</span>
              ROMPT <span className="font-medium text-4xl sm:text-5xl">J</span>
              OURNALING
            </h1>
          </div>
        </motion.div>
        <motion.div variants={fadeInUp} className="w-full flex justify-center">
          <p className="max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
            Build a powerful mindset in minutes a day. Personalized prompts
            guide your thoughts toward clarity, purpose, and daily progress.
          </p>
        </motion.div>
        {/* Morning/Evening Prompts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 sm:mt-0 max-w-lg mx-auto">
          <motion.div
            className="flex items-center justify-center text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4 min-h-[80px] sm:min-h-[100px]"
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center justify-center w-full max-w-xs">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-amber-500/20 rounded-full flex items-center justify-center">
                <FaSun className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-400" />
              </div>
              <div className="text-center mt-2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-1 leading-tight">
                  Morning Prompts
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-tight">
                  Start your day with <br className="hidden md:block" /> purpose
                  and intention.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4 min-h-[80px] sm:min-h-[100px]"
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center justify-center w-full max-w-xs">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <FaMoon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-violet-400" />
              </div>
              <div className="text-center mt-2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-1 leading-tight">
                  Evening Prompts
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-tight">
                  Reflect and track <br className="hidden md:block" /> your
                  personal growth.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div className="pt-8" variants={fadeInUp}>
        <Link href="/sign-in">
          <motion.button
            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 text-white font-bold leading-relaxed overflow-hidden group relative inline-flex items-center justify-center py-3 sm:py-5 px-12 rounded-full text-xl sm:text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-origin-border"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 block lg:inline">
              <span className="block lg:inline">Think better,</span>
              <span className="block lg:inline"> Live better</span>
            </span>
            <motion.svg
              className="ml-3 w-8 h-8 group-hover:translate-x-1 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                fill="currentColor"
              />
            </motion.svg>

            <div className="absolute inset-0 pointer-events-none rounded-full">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
          </motion.button>
        </Link>
      </motion.div>

      {/* Social Proof Hint */}
      <motion.p
        className="text-sm text-muted-foreground py-4"
        variants={fadeInUp}
      >
        A guided mental health app — early access.
      </motion.p>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Close Button */}
          {!isMobile && (
            <div
              className="absolute top-4 right-4 z-10 cursor-pointer"
              onClick={handleCloseDrawer}
            >
              <X />
            </div>
          )}

          {/* Main Content */}
          <motion.div
            className="h-full flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sectionVariants}
            transition={{ duration: 0.3 }}
          >
            {isMobile ? (
              // Mobile: Keep original ScrollArea approach
              <div className="flex-grow px-4 overflow-scroll relative pt-72 pb-8">
                <div className="relative z-10 h-full flex flex-col justify-center items-center p-0 my-6">
                  <ContentComponent />
                </div>
              </div>
            ) : (
              // Desktop: Full viewport height, centered, no scroll
              <div className="h-screen flex flex-col justify-center items-center px-6 relative z-10">
                <ContentComponent />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
