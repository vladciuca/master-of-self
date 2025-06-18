import { motion } from "framer-motion";
import { sectionVariants } from "../../landing-page/LandingPage";

const sections = [
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

export function MindsetBehaviorSection() {
  return (
    <motion.section
      className="grid grid-rows-1 gap-8 px-6 py-8 justify-center"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      {sections.map((section, index) => (
        <div key={index} className="my-8 max-w-[900px]">
          <h3 className={`text-4xl font-bold text-center lg:text-left`}>
            {section.title}
          </h3>
          <ul className="mt-4 list-inside">
            {section.list.map((item, idx) => (
              <li key={idx} className="mt-2">
                <h4 className={`font-semibold text-lg ${section.color}`}>
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
