"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

type IdentityPageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
};

export function IdentityPage({
  isDrawerOpen,
  handleCloseDrawer,
}: IdentityPageProps) {
  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          className="h-full flex flex-col"
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute top-4 right-4 z-10 cursor-pointer"
            onClick={handleCloseDrawer}
          >
            <X />
          </div>
          <ScrollArea className="flex-grow">
            <main className="min-h-screen">
              <HeroSection isDrawerOpen={isDrawerOpen} />
              <IdentitySection isDrawerOpen={isDrawerOpen} />
              <BelievesSection isDrawerOpen={isDrawerOpen} />
              <BehaviorSection isDrawerOpen={isDrawerOpen} />
            </main>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeroSection({ isDrawerOpen }: { isDrawerOpen: boolean }) {
  return (
    <section className="py-20 text-center">
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* <motion.h1
              className="text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            ></motion.h1> */}
            <motion.h1
              className="text-6xl font-bold mb-4 leading-snug"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              Design Your
              <br /> <span className="text-green-500 mr-2">2.0</span>Self
            </motion.h1>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

type AnimatedSectionProps = {
  subtitle: string;
  content: string;
  id: string;
  isDrawerOpen: boolean;
};

function AnimatedSection({
  subtitle,
  content,
  id,
  isDrawerOpen,
}: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.section
          id={id}
          ref={ref}
          className="py-12 border mx-12 mb-12 rounded-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-center">{subtitle}</h3>
            <div className="w-full flex justify-center my-12">
              <motion.div
                className={`h-20 w-20 ${
                  id === "identity"
                    ? "bg-blue-500 rounded-full"
                    : id === "behavior"
                    ? "bg-pink-500 rounded-xl"
                    : id === "believes"
                    ? "bg-purple-500 rounded-3xl"
                    : "bg-gray-500 rounded-full"
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-lg leading-relaxed text-center text-muted-foreground">
              {content}
            </p>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function IdentitySection({ isDrawerOpen }: { isDrawerOpen: boolean }) {
  return (
    <AnimatedSection
      isDrawerOpen={isDrawerOpen}
      id="identity"
      subtitle="Visualize Your Ideal Self"
      content="Imagine your most empowered version. Describe the appearance of your 2.0 self in vivid detail, from accessories to clothing and style, let your creativity shine as you craft the best version of you. We'll bring it to life through a custom avatar that reflects your ideal vision."
    />
  );
}

function BelievesSection({ isDrawerOpen }: { isDrawerOpen: boolean }) {
  return (
    <AnimatedSection
      isDrawerOpen={isDrawerOpen}
      id="believes"
      subtitle="What are your Achievements?"
      content="Envision your ideal self's accomplishments and write them down as powerful affirmations in the present tense: 'I earn...', 'I make...', 'I drive...'. By framing your goals this way, you tap into the mindset of success. Select one goal, break it down into actionable steps, and map out your hero's journey by setting clear milestones along the way. Each milestone represents progress, and with each step, you're closer to becoming your 2.0 self. Build habits with actions that align to these milestones, ensuring steady growth towards your ultimate achievements."
    />
  );
}

function BehaviorSection({ isDrawerOpen }: { isDrawerOpen: boolean }) {
  return (
    <AnimatedSection
      isDrawerOpen={isDrawerOpen}
      id="behavior"
      subtitle="What are your Key Habits?"
      content="Success is built on consistent actions. To bridge the gap between who you are now and your 2.0 self, identify the essential habits that will drive your transformation. These are the daily or weekly actions that, when repeated, lead to achieving your bigger goals. Whether it's developing a morning routine, staying focused on deep work, or committing to lifelong learning, these habits will drive your progress and help you align with the version of yourself you're striving to become."
    />
  );
}
