"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaSun, FaMoon, FaBoltLightning } from "react-icons/fa6";
import { X } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { opacity: { delay: 0.2 }, duration: 0.8 },
  },
  exit: { opacity: 0, y: 50 },
};

type LandingPageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
};

export function LandingPage({
  isDrawerOpen,
  handleCloseDrawer,
}: LandingPageProps) {
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
          <motion.div
            className="h-full flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sectionVariants}
            transition={{ duration: 0.3 }}
          >
            <ScrollArea className="flex-grow my-2">
              <main className="min-h-screen px-6 py-12">
                <HeroSection />
                <IntroductionSection />
                <ThreeCardsSection />
                <ScienceSection />
                <MindsetBehaviorSection />
              </main>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function HeroSection() {
  return (
    <section className="text-center py-20">
      <motion.h1 className="leading-snug space-y-4">
        <span className="text-5xl block uppercase font-semibold">
          They say life is a game
        </span>
        <span className="text-4xl block uppercase font-semibold">
          But how do you play it !?
        </span>
      </motion.h1>
    </section>
  );
}

function IntroductionSection() {
  return (
    <motion.section className="text-center py-12" variants={sectionVariants}>
      <h1 className="text-xl">
        Journaling in <strong className="text-teal-500">MOS</strong> is designed
        as a <strong className="text-teal-500">gameplay loop</strong> that
        reinforces motivation through positivity, leveraging{" "}
        <strong className="text-teal-500">score systems</strong> inspired by
        RPGs to help you gain perspective and track progress.
      </h1>
    </motion.section>
  );
}

function ThreeCardsSection() {
  const cards = [
    {
      icon: <FaSun />,
      bg: "bg-yellow-500",
      title: "Start Your Day with Purpose",
      content:
        "Morning journaling incentivises you set a positive tone for the day by focusing on gratitude and goal setting.",
      list: [
        {
          key: "Gratitude Practice:",
          text: "Acknowledge the good in your life cultivating positivity and boosting Willpower.",
        },
        {
          key: "Setting Intentions:",
          text: "Define clear, meaningful, and achievable goals and stay motivated throughout the day.",
        },
      ],
    },
    {
      icon: <FaMoon />,
      bg: "bg-purple-500",
      title: "Reflect and Grow",
      content:
        "Evening journaling allows you to track progress, reflect on key moments, and build momentum for the next day.",
      list: [
        {
          key: "Goal Completion:",
          text: "Mark off tasks you accomplished and recognize your daily wins.",
        },
        {
          key: "Daily Highlights:",
          text: "Capture meaningful moments that brought joy or taught valuable lessons.",
        },
        {
          key: "Self-Improvement:",
          text: "Reflect on what you'd change if you could relive the day, fostering growth and adaptability.",
        },
      ],
    },
    {
      icon: <FaBoltLightning />,
      bg: "bg-pink-400",
      title: "Earn & Leverage Willpower",
      content:
        "Score systems rewards deep reflection and meaningful journaling, making self-improvement an engaging challenge.",
      list: [
        {
          key: "Morning Entries:",
          text: "The more details you add, the more Willpower you generate for the day.",
        },
        {
          key: "Evening Reflections:",
          text: "Completing the journal earns you bonus Willpower for tomorrow.",
        },
        {
          key: "Motivation Boost:",
          text: "The more consistent and thorough you are, the stronger your momentum becomes.",
        },
      ],
    },
  ];

  return (
    <motion.section
      className="grid grid-rows-3 gap-6 px-6"
      variants={sectionVariants}
    >
      {cards.map(({ icon, bg, title, content, list }, index) => (
        <motion.div
          key={index}
          className={`w-full flex flex-col items-center justify-center p-6 rounded-3xl text-white ${bg}`}
        >
          <span className="mb-4 text-4xl">{icon}</span>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-center mt-3 mb-8">{content}</p>
          <ul className="list-disc pl-5 text-sm">
            {list.map((list) => {
              const { key, text } = list;
              return (
                <li key={key}>
                  <span className="font-bold mr-1">{key}</span>
                  {text}
                </li>
              );
            })}
          </ul>
        </motion.div>
      ))}
    </motion.section>
  );
}

function MindsetBehaviorSection() {
  const cards = [
    {
      title: "How It Changes Mindset",
      color: "text-pink-400",
      list: [
        {
          listTitle: "Shifts Focus to Positivity & Gratitude",
          listItem: [
            "The brain has a natural <strong>negativity bias</strong> (we focus on problems more than positives).",
            "By consistently listing things you're grateful for, you <strong>train your brain</strong> to notice the good instead of dwelling on stress or negativity.",
            "Over time, this <strong>rewires neural pathways</strong>, making positivity your default perspective.",
          ],
        },
        {
          listTitle: "Encourages a Growth Mindset",
          listItem: [
            "Writing <strong>affirmations</strong> (e.g., 'I am confident and capable') reinforces a <strong>growth-oriented identity</strong>.",
            "By reflecting on how the day could have been better, you adopt a <strong>learning mindset</strong> rather than feeling like a failure.",
            "This leads to <strong>resilience</strong> and a proactive approach to challenges.",
          ],
        },
        {
          listTitle: "Boosts Self-Awareness & Emotional Intelligence",
          listItem: [
            "Journaling daily <strong>forces you to slow down</strong> and become aware of your thoughts, emotions, and actions.",
            "This increases <strong>emotional intelligence</strong>, helping you recognize triggers, patterns, and habits.",
            "With higher <strong>self-awareness</strong>, you become more intentional in how you react to life.",
          ],
        },
      ],
    },
    {
      title: "How It Changes Behavior",
      color: "text-amber-500",
      list: [
        {
          listTitle: "Increases Productivity & Intentionality",
          listItem: [
            "Writing down 'What would make today great?' primes your brain to focus on <strong>small</strong>, <strong>achievable goals</strong>.",
            "This creates a <strong>clear direction</strong> for the day, reducing distractions and procrastination.",
            "Small, daily wins <strong>compound</strong> into long-term success.",
          ],
        },
        {
          listTitle: "Strengthens Habit Formation",
          listItem: [
            "Consistently reflecting on 'What went well?' and 'What could be better?' builds the habit of <strong>self-improvement</strong>.",
            "Positive reinforcement (celebrating small wins) <strong>motivates continued action</strong>.",
            "Over time, new <strong>habits form naturally</strong> because you see progress.",
          ],
        },
        {
          listTitle: "Reduces Stress & Anxiety",
          listItem: [
            "Gratitude journaling <strong>lowers cortisol (stress hormone)</strong> and increases serotonin and dopamine (happiness chemicals).",
            "Writing about the day’s wins <strong>shifts focus away from worries and toward progress.</strong>",
            "<strong>Regular reflection</strong> prevents small stressors from snowballing into burnout.",
          ],
        },
      ],
    },
  ];

  return (
    <motion.section
      className="grid grid-rows-1 gap-8 px-6 py-8"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <div key={index} className="my-8">
          <h3 className={`text-4xl font-bold`}>{card.title}</h3>
          <ul className="mt-4 list-inside">
            {card.list.map((item, idx) => (
              <li key={idx} className="mt-2">
                <h4 className={`font-semibold text-lg ${card.color}`}>
                  {item.listTitle}
                </h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {item.listItem.map((point, pointIdx) => (
                    <li
                      key={pointIdx}
                      className="ml-4"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </motion.section>
  );
}

function ScienceSection() {
  const cards = [
    {
      icon: "🧠",
      title: "Neuroplasticity",
      text: "Your brain strengthens pathways you use repeatedly.",
    },
    {
      icon: "⚡",
      title: "Reticular Activating System (RAS)",
      text: "Helps you focus on what matters.",
    },
    {
      icon: "💡",
      title: "Cognitive Reframing",
      text: "Turns self-criticism into growth.",
    },
  ];

  return (
    <motion.section
      className="text-center px-6 mt-24"
      variants={sectionVariants}
    >
      <h3 className="text-4xl font-bold mb-4">The Science in Action</h3>
      <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
        This structured approach is built on principles of{" "}
        <strong className="text-primary">positive psychology</strong>, cognitive
        behavioral therapy (CBT), and neuroscience** to rewire your mindset and
        shape long-term behavior.
      </p>

      <motion.section
        className="grid grid-cols-3 gap-12 px-8 py-12 max-w-6xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map(({ icon, title, text }) => (
          <motion.div
            key={title}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="text-5xl mb-2">{icon}</div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {text}
            </p>
          </motion.div>
        ))}
      </motion.section>
    </motion.section>
  );
}
