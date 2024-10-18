"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Zap,
  Shield,
  Book,
  ArrowUpRight,
} from "lucide-react";
import { useSideContent } from "@/context/SideContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SideContent() {
  const { isDrawerOpen, setIsDrawerOpen } = useSideContent();

  return (
    <>
      <ScrollArea
        className={`hidden md:block h-full bg-secondary rounded-tr-xl rounded-br-xl relative z-10 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "w-[65%]" : "w-0 overflow-hidden"
        }`}
      >
        <div
          className={`h-full p-24 px-16 space-y-12 transition-opacity duration-100 ease-in-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Hero Section */}
          <section className="text-center flex flex-col items-center h-screen space-y-20 pt-14">
            <h1 className="text-6xl font-bold text-primary">
              Craft your identity <br />& become the best version of yourself
            </h1>
            <p className="text-4xl text-muted-foreground">
              Track progress, align goals, and create lasting change.
            </p>
            <Button className="text-lg">Start Your Journey</Button>
          </section>

          {/* Who is this for? */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Who is this for?</h2>
            <p>
              People seeking to build habits that align with their identity,
              long-term goals, and personal growth. Users are tired of feeling
              guilty or stuck in gamified habit-tracking systems that don't lead
              to lasting change.
            </p>
          </section>

          {/* What do I get from it? */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What do I get from it?</h2>
            <p>
              A system that helps you align your goals with your habits by
              focusing on your identity and reinforcing positive change without
              guilt, through a powerful combination of habit tracking, goal
              management, and journaling.
            </p>
          </section>

          {/* Unique Result */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Unique Result</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Target className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Build your identity first, using goals and habits as tools to
                  reinforce it.
                </span>
              </li>
              <li className="flex items-start">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Earn XP and level up in life with every habit you track.
                </span>
              </li>
              <li className="flex items-start">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Experience a natural, positive shift as your actions align
                  with your long-term vision.
                </span>
              </li>
            </ul>
          </section>

          {/* Why Trust Us? */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Why Trust Us?</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Book className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Proven Identity-Based Approach based on James Clear's Atomic
                  Habits.
                </span>
              </li>
              <li className="flex items-start">
                <Target className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Real-World Behavioral Change focused on reinforcing positive
                  identity.
                </span>
              </li>
              <li className="flex items-start">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Structured Like a Game, Powered by Behavioral Science.
                </span>
              </li>
            </ul>
          </section>

          {/* Key Feature Highlights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Key Feature Highlights</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Book className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Daily Journaling routines to boost positivity and focus.
                </span>
              </li>
              <li className="flex items-start">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                <span>
                  XP and Habit Levels to track your progress towards mastery.
                </span>
              </li>
              <li className="flex items-start">
                <Target className="mr-2 h-5 w-5 text-primary" />
                <span>
                  Strategic Adaptation to stay flexible while remaining
                  goal-focused.
                </span>
              </li>
            </ul>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">
              Ready to Master Yourself?
            </h2>
            <Button className="text-lg">
              Get Started Now
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
          </section>
        </div>
      </ScrollArea>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4 z-50 md:flex hidden"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        {isDrawerOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </>
  );
}
