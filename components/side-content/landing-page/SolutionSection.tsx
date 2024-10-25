import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { IoCheckmarkOutline } from "react-icons/io5";

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
    <section className="h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInTransitionFromLeft}
            transition={{ duration: 0.5 }}
            className="max-w-3xl px-4 flex flex-col space-y-24"
          >
            {/* DESCRIPTION */}
            <p
              className="mx-10 -mt-12 mb-12 text-xl text-muted-foreground"
              // initial="hidden"
              // animate="visible"
              // variants={fadeInTransitionFromBottom}
              // transition={{ duration: 1, delay: 1.5 }}
            >
              True transformation begins by focusing on who you are. When you
              reshape your identity first, your goals and habits naturally fall
              into place, leading to lasting change.
            </p>

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
                    className="relative text-6xl font-bold rounded-3xl h-24 w-24 bg-purple-500 flex items-center justify-center"
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
                    className="relative text-6xl font-bold rounded-xl h-24 w-24 bg-pink-500 flex items-center justify-center"
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

            <motion.div
              className="w-full flex justify-center text-green-400 -mt-12 pb-12"
              initial="hidden"
              animate="visible"
              variants={fadeInTransitionFromBottom}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="rounded-full p-2">
                <IoCheckmarkOutline size={"8rem"} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
