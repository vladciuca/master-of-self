import { motion } from "framer-motion";
import { FaSun, FaMoon, FaBoltLightning } from "react-icons/fa6";
import { sectionVariants } from "../LandingPage";

const cards = [
  {
    icon: <FaSun />,
    bg: "bg-amber-400",
    textColor: "text-white",
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
      {
        key: "Empowering Affirmations:",
        text: "Start your day with positive affirmations to build self-confidence, reinforce a growth mindset, and cultivate resilience against challenges.",
      },
    ],
  },
  {
    icon: <FaMoon />,
    bg: "bg-violet-500",
    textColor: "text-white",
    title: "Reflect and Grow",
    content:
      "Evening journaling allows you to track progress, reflect on key moments, and build momentum for the next day.",
    list: [
      {
        key: "Goal Completion:",
        text: "Mark off tasks you accomplished and recognize your daily wins exponentially increasing motivation.",
      },
      {
        key: "Daily Highlights:",
        text: "Capture meaningful moments that brought joy or taught valuable lessons and bring awareness to the positive things in your life.",
      },
      {
        key: "Self-Improvement:",
        text: "Reflect on what you'd change if you could relive the day, fostering growth, adaptability and resilience.",
      },
    ],
  },
  {
    icon: <FaBoltLightning />,
    bg: "bg-teal-500",
    textColor: "text-white",
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

export function CardsSection() {
  return (
    <motion.section
      className="grid grid-rows-3 gap-6 px-6 justify-center"
      variants={sectionVariants}
    >
      {cards.map(({ icon, bg, textColor, title, content, list }, index) => (
        <motion.div
          key={index}
          className={`max-w-[550px] flex flex-col items-center justify-center p-6 rounded-3xl ${textColor} ${bg}`}
        >
          <span className="mb-4 text-4xl">{icon}</span>
          <h3 className="text-2xl font-bold">{title}</h3>
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
