import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Book, Shield, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { HeroSection } from "./HeroSection";

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
      <HeroSection isDrawerOpen={isDrawerOpen} />

      <section className="container mx-auto py-20 px-4">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-96 h-96 rounded-full bg-pink-500 flex items-center justify-center">
              <div className="w-52 h-52 rounded-full bg-purple-500 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex space-x-4">
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>{" "}
              ACTIONS
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>{" "}
              STORIES
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>{" "}
              IDENTITY
            </span>
          </div>
        </div>

        <Card className="bg-gray-800 mb-6">
          <CardContent className="p-4">
            <p className="text-sm">
              Most people approach change by taking some actions to change their
              believes / stories and hopefully, if it lasts long enough, they
              will change their identity.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                3
              </span>
              <span className="text-pink-500">ACTIONS</span>
              <span className="text-gray-500">→</span>
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                2
              </span>
              <span className="text-purple-500">STORIES</span>
              <span className="text-gray-500">→</span>
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                1
              </span>
              <span className="text-blue-500">IDENTITY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 mb-6">
          <CardContent className="p-4">
            <p className="text-sm">
              REAL CHANGE happens when you rewire yourself at the IDENTITY
              level, adopting the new identity, creating it ahead of time, it
              surpasses your stories and then your actions fall in alignment.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                1
              </span>
              <span className="text-blue-500">IDENTITY</span>
              <span className="text-gray-500">→</span>
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                2
              </span>
              <span className="text-purple-500">STORIES</span>
              <span className="text-gray-500">→</span>
              <span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                3
              </span>
              <span className="text-pink-500">ACTIONS</span>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm italic">
          In this way "your actions become a vote towards the person you want to
          become".
          <span className="block mt-2">
            (source: Atomic Habits by James Clear)
          </span>
        </p>
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
