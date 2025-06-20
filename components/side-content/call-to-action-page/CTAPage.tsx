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
      className="w-full max-w-4xl mx-auto text-center space-y-4"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {/* Main Headline */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tight"
        variants={fadeInUp}
      >
        <span className="block">"You Are What</span>
        {/* <span className="block bg-clip-text text-teal-500"></span> */}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-300">
          You Think."
        </span>
        <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 text-gray-300">
          — Marcus Aurelius
        </span>
      </motion.h1>

      {/* Benefit Points */}
      <motion.div
        className="space-y-4 max-w-3xl mx-auto pt-8"
        variants={fadeInUp}
      >
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Shape your mindset through daily prompts, reflective journaling, and
          powerful habits — all in a shared, motivating space.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 p-4">
          <motion.p
            className="text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4"
            variants={fadeInUp}
          >
            ✅ Ask better questions
          </motion.p>
          <motion.p
            className="text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4"
            variants={fadeInUp}
          >
            ✅ Give honest answers
          </motion.p>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl text-primary font-light max-w-3xl mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          Build discipline by choosing the right thoughts, every day
        </motion.p>
      </motion.div>

      {/* CTA Button */}
      <motion.div className="pt-12" variants={fadeInUp}>
        <Link href="/sign-in">
          <motion.button
            className="group relative inline-flex items-center justify-center font-bold py-6 px-12 rounded-full text-xl sm:text-2xl shadow-2xl text-white bg-[linear-gradient(to_right,_#fbbe25_50%,_#8a5cf7_50%)] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-origin-border"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Master Self</span>
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

            {/* Button shine effect */}
            {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" /> */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-1/2 group-hover:translate-x-1/2 transition-transform duration-1000 ease-out" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Social Proof Hint */}
      <motion.p
        className="text-sm text-gray-500 pt-4 italic"
        variants={fadeInUp}
      >
        Join thousands building better habits daily
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
