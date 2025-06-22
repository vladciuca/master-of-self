import { motion } from "framer-motion";
import { GiBrain, GiArcheryTarget, GiLightBulb } from "react-icons/gi";
import { sectionVariants } from "../../landing-page/LandingPage";

const cards = [
  {
    icon: <GiBrain />,
    title: "Neuroplasticity",
    text: "Your brain strengthens pathways you use repeatedly.",
  },
  {
    icon: <GiArcheryTarget />,
    title: "Reticular Activating System (RAS)",
    text: "Helps you focus on what matters.",
  },
  {
    icon: <GiLightBulb />,
    title: "Cognitive Reframing",
    text: "Turns self-criticism into growth.",
  },
];

export function ScienceSection() {
  return (
    <motion.section
      className="text-center px-6 mt-24"
      variants={sectionVariants}
    >
      {/* <h3 className="text-4xl font-bold mb-4"></h3> */}

      <h1 className="mb-16 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
        The Science in{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
          Action
        </span>
      </h1>
      <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
        This structured approach is built on principles of{" "}
        <strong className="text-primary">positive psychology</strong>,{" "}
        <strong className="text-primary">
          cognitive behavioral therapy (CBT)
        </strong>
        , and <strong className="text-primary">neuroscience</strong> to rewire
        your mindset and shape long-term behavior.
      </p>

      <motion.section
        className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-8 py-12 max-w-6xl mx-auto"
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
            <p className="text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          </motion.div>
        ))}
      </motion.section>
    </motion.section>
  );
}
