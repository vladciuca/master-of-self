"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  FaDiscord,
  FaUsers,
  FaTrophy,
  FaLightbulb,
  FaFire,
} from "react-icons/fa6";

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

export function DiscordPage({
  isDrawerOpen,
  handleCloseDrawer,
  isMobile = false,
}: PageProps) {
  const handleJoinDiscord = () => {
    // Replace with your actual Discord invite link
    window.open("https://discord.gg/UmE4K4kM", "_blank");
  };

  const ContentComponent = () => (
    <motion.div
      className="w-full max-w-4xl mx-auto text-center space-y-4 pt-16 sm:pt-0"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {/* Discord Logo */}
      <motion.div variants={fadeInUp} className="flex justify-center">
        <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm">
          <FaDiscord className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400" />
        </div>
      </motion.div>

      {/* Main Headline */}
      <motion.div variants={fadeInUp}>
        <motion.h1
          variants={fadeInUp}
          className="py-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tight"
        >
          <span className="block text-3xl md:text-4xl lg:text-5xl">
            Join Our
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
            Community
          </span>
        </motion.h1>

        <motion.div variants={fadeInUp} className="w-full flex justify-center">
          <div className="max-w-md mt-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary pt-4">
              <span className="font-medium text-3xl sm:text-4xl">C</span>
              ONNECT WITH{" "}
              <span className="font-medium text-3xl sm:text-4xl">F</span>
              ELLOW <span className="font-medium text-3xl sm:text-4xl">S</span>
              ELF-<span className="font-medium text-3xl sm:text-4xl">M</span>
              ASTERS
            </h2>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="w-full flex justify-center">
          <p className="max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
            Ready to level up together? Join thousands of motivated individuals
            on their journey to self-mastery. Share progress, get support, and
            stay accountable.
          </p>
        </motion.div>

        {/* Community Features Grid */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 sm:pt-4 sm:mt-0 max-w-4xl mx-auto">
          <motion.div
            className="flex items-center justify-center text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4 min-h-[100px] sm:min-h-[120px] border border-white/5"
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-green-500/20 rounded-full flex items-center justify-center">
                <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <div className="text-center mt-2">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-primary mb-1 leading-tight">
                  Daily Accountability
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                  Share your progress and stay motivated
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4 min-h-[100px] sm:min-h-[120px] border border-white/5"
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FaLightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <div className="text-center mt-2">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-primary mb-1 leading-tight">
                  Expert Tips
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                  Get advice from experienced self-masters
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4 min-h-[100px] sm:min-h-[120px] border border-white/5"
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-orange-500/20 rounded-full flex items-center justify-center">
                <FaFire className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
              </div>
              <div className="text-center mt-2">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-primary mb-1 leading-tight">
                  Challenges
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                  Participate in community challenges
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center text-sm sm:text-base md:text-lg text-primary backdrop-blur-sm rounded-lg p-2 md:p-4 min-h-[100px] sm:min-h-[120px] border border-white/5"
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                <FaTrophy className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div className="text-center mt-2">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-primary mb-1 leading-tight">
                  Rewards
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                  Earn exclusive community rewards
                </p>
              </div>
            </div>
          </motion.div>
        </div> */}
      </motion.div>

      {/* CTA Button */}
      <motion.div className="pt-8" variants={fadeInUp}>
        <motion.button
          onClick={handleJoinDiscord}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold leading-relaxed overflow-hidden group relative inline-flex items-center justify-center py-3 sm:py-5 px-12 rounded-full text-xl sm:text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-origin-border"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <FaDiscord className="mr-3 w-6 h-6" />
          <span className="relative z-10 block lg:inline">
            <span className="block lg:inline">Join Discord</span>
            <span className="block lg:inline"> Server</span>
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
      </motion.div>

      {/* Social Proof Hint */}
      {/* <motion.p
        className="text-sm text-muted-foreground py-4"
        variants={fadeInUp}
      >
        Join thousands of self-masters — community first.
      </motion.p> */}
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
