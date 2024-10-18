import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Book, Shield, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
      {/* NEW Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="max-w-3xl px-4"
            >
              <motion.h1
                className="mb-6 text-6xl font-bold tracking-tight"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 1 }}
              >
                Craft your identity
              </motion.h1>
              <motion.h1
                className="my-6 text-6xl font-bold tracking-tight"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Master your actions
              </motion.h1>

              <motion.p
                className="mb-8 text-xl text-muted-foreground"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 1, delay: 1 }}
              >
                Track progress, align goals, and create lasting change.
              </motion.p>
              {/* <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 1, delay: 1 }}
              >
                <Button className="px-6 py-3 text-lg">Get Early Access</Button>
              </motion.div> */}
            </motion.div>
          )}
        </AnimatePresence>
        {/* <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?text=Abstract+Background')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.09,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        /> */}
      </section>

      {/* Category Cards */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Discover Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Who is this for?",
              content:
                "People seeking to build habits that align with their identity, long-term goals, and personal growth.",
              icon: Target,
            },
            {
              title: "What do I get from it?",
              content:
                "A system that helps you align your goals with your habits by focusing on your identity and reinforcing positive change without guilt.",
              icon: Zap,
            },
            {
              title: "Why Trust Us?",
              content:
                "Proven Identity-Based Approach based on James Clear's Atomic Habits and real-world behavioral change strategies.",
              icon: Shield,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-indigo-500 transition-colors duration-300">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <item.icon className="h-8 w-8 text-indigo-400" />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{item.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Key Feature Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Book,
                title: "Daily Journaling",
                content:
                  "Boost positivity and focus with guided journaling routines.",
              },
              {
                icon: Zap,
                title: "XP and Habit Levels",
                content:
                  "Track your progress towards mastery with gamified elements.",
              },
              {
                icon: Target,
                title: "Strategic Adaptation",
                content:
                  "Stay flexible while remaining goal-focused with adaptive planning.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <feature.icon className="h-16 w-16 text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to Master Yourself?</h2>
          <Button className="text-lg bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300">
            Get Started Now
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
