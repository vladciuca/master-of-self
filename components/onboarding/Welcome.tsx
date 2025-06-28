"use client";
import { motion } from "framer-motion";
import { Zap, Target, TrendingUp } from "lucide-react";

import { DaySplit } from "@components/profile/DaySplit";

export function Welcome({ firstName }: { firstName: string }) {
  const features = [
    {
      icon: Zap,
      title: "Disciplines – Grow From the Inside Out",
      text: "Develop traits like focus, confidence, or patience by reflecting on daily prompts. Track your growth with increased Willpower along the way.",
    },
    {
      icon: Target,
      title: "Habits – Take Consistent Action",
      text: "Set simple, trackable actions to stay consistent and accountable. Group them by goal, and build progress step by step.",
    },
    {
      icon: TrendingUp,
      title: "Daily Momentum",
      text: "Each check-in moves you forward. The more you engage, the stronger your routines and self-awareness become.",
    },
  ];

  return (
    <div className="min-h-full flex flex-col justify-center items-center px-2 sm:px-6 pt-2 sm:pt-8">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Hello, {firstName}!
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Begin building the best version of yourself - one day at a time.
          </motion.p>
        </motion.div>

        {/* Description and Features */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-center text-sm sm:text-base leading-relaxed sm:mb-8">
            Your day is split into two focused journaling sessions - morning and
            evening. Reflect on daily prompts during each session to build
            consistent habits and track your personal growth.
          </p>

          {/* <div className="space-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4 px-4 py-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 1.0 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div> */}

          <DaySplit onboarding />
        </motion.div>
      </div>
    </div>
  );
}
