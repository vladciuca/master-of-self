import { motion } from "framer-motion";
import { sectionVariants } from "../LandingPage";

export function IntroductionSection() {
  return (
    <motion.section
      className="flex justify-center text-center w-full pt-24 pb-44 px-4"
      variants={sectionVariants}
    >
      <h1 className="text-xl max-w-[800px]">
        <strong>Journaling</strong> and <strong>habit tracking</strong> is
        designed as a <strong className="text-teal-500">gameplay loop</strong>{" "}
        that reinforces motivation through positivity, leveraging{" "}
        <strong className="text-teal-500">score systems</strong> inspired by
        RPGs to help you gain perspective and track progress.
      </h1>
    </motion.section>
  );
}
