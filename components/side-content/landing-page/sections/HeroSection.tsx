import { motion } from "framer-motion";
import { IoGameController } from "react-icons/io5";

export function HeroSection() {
  return (
    <section className="text-center py-20">
      <motion.h1 className="leading-snug space-y-4">
        <span className="text-5xl block uppercase font-semibold">
          They say life is a game
        </span>

        <span className="w-full text-center flex justify-center">
          <IoGameController size={80} className="mb-8" />
        </span>

        <span className="text-4xl block uppercase font-semibold">
          But how do you play it !?
        </span>
      </motion.h1>
    </section>
  );
}
