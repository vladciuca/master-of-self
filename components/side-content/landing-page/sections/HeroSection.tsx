"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="block mb-2 md:mb-4">
              Life is a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-violet-400">
                game
              </span>
              ,
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-primary">
              but how do you{" "}
              <span className="text-primary font-bold">play it</span>?
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-8 pt-8"
          >
            Everyday is a{" "}
            <span className="text-amber-400 font-semibold">gameplay loop</span>,{" "}
            designed to reinforce motivation through positivity, leveraging{" "}
            <span className="text-violet-400 font-semibold">score systems</span>{" "}
            inspired by RPGs to help you gain perspective on your progress.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
