import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";

const fadeInTransitionFromLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const fadeInTransitionFromBottom = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SolutionSection({ isActive = true }: { isActive?: boolean }) {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInTransitionFromLeft}
            transition={{ duration: 0.5 }}
            className="max-w-3xl px-4"
          >
            <motion.div
              className="w-full flex justify-center text-green-400 -mt-24 pb-24"
              initial="hidden"
              animate="visible"
              variants={fadeInTransitionFromBottom}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <Check size={80} />
            </motion.div>

            {/* IDENTITY TO ACTIONS 1>2>3 */}
            <div className="mt-12 flex items-center justify-center xl:space-x-4 relative w-full">
              {/* IDENTITY - 1 */}
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="relative text-6xl font-bold rounded-full h-24 w-24 bg-blue-500 flex items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInTransitionFromLeft}
                    transition={{ duration: 1 }}
                  >
                    <motion.h1
                      className="absolute -top-12 text-2xl font-semibold"
                      initial="hidden"
                      animate="visible"
                      variants={fadeInTransitionFromLeft}
                      transition={{ duration: 1 }}
                    >
                      IDENTITY
                    </motion.h1>
                  </motion.div>
                </div>
              </div>

              <motion.div
                className="flex items-center justify-center"
                initial="hidden"
                animate="visible"
                variants={fadeInTransitionFromLeft}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <ChevronRight size={50} />
              </motion.div>
              {/* BEHAVIOR - 2 */}
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="relative text-6xl font-bold rounded-full h-24 w-24 bg-purple-500 flex items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInTransitionFromLeft}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.h1
                      className="absolute -top-12 text-2xl font-semibold"
                      initial="hidden"
                      animate="visible"
                      variants={fadeInTransitionFromLeft}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      BELIEVES
                    </motion.h1>
                  </motion.div>
                </div>
              </div>

              <motion.div
                className="flex items-center justify-center"
                initial="hidden"
                animate="visible"
                variants={fadeInTransitionFromLeft}
                transition={{ duration: 1, delay: 1 }}
              >
                <ChevronRight size={50} />
              </motion.div>
              {/* ACTIONS - 3 */}
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="relative text-6xl font-bold rounded-full h-24 w-24 bg-pink-500 flex items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInTransitionFromLeft}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    <motion.h1
                      className="absolute -top-12 text-2xl font-semibold"
                      initial="hidden"
                      animate="visible"
                      variants={fadeInTransitionFromLeft}
                      transition={{ duration: 1, delay: 1 }}
                    >
                      BEHAVIOR
                    </motion.h1>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <motion.p
              className="mx-10 mt-8 text-xl text-muted-foreground"
              initial="hidden"
              animate="visible"
              variants={fadeInTransitionFromBottom}
              transition={{ duration: 1, delay: 1.5 }}
            >
              True transformation begins by focusing on who you are. When you
              reshape your identity first, your goals and habits naturally fall
              into place, leading to lasting change.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
