import { motion, AnimatePresence } from "framer-motion";

const fadeInTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const ConcentricShapes = ({ isActive = true }: { isActive?: boolean }) => {
  return (
    <div className="flex justify-center my-12 mb-20">
      <div className="relative w-56 h-56">
        <AnimatePresence>
          {isActive && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute inset-0 rounded-xl bg-pink-500"
              />
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 1, delay: 1 }}
                className="absolute inset-0 m-auto w-32 h-32 rounded-3xl bg-purple-500"
              />
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-500"
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConcentricShapes;

export function HeroSection({ isActive = true }: { isActive?: boolean }) {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInTransition}
            transition={{ duration: 0.5 }}
            className="max-w-3xl px-4"
          >
            <div className="mb-6 text-2xl font-bold tracking-tight text-muted-foreground">
              build the best version of yourself
            </div>
            <ConcentricShapes isActive={isActive} />
            <motion.h1
              className="mb-6 text-6xl font-bold tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeInTransition}
              transition={{ duration: 1, delay: 0.5 }}
            >
              from IDENTITY
            </motion.h1>
            <motion.h1
              className="my-6 text-6xl font-bold tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeInTransition}
              transition={{ duration: 1, delay: 1 }}
            >
              to BELIEVES
            </motion.h1>

            <motion.h1
              className="my-6 text-6xl font-bold tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeInTransition}
              transition={{ duration: 1, delay: 1.5 }}
            >
              and BEHAVIOR
            </motion.h1>

            {/* <motion.div
             initial="hidden"
             animate="visible"
             variants={fadeInTransition}
             transition={{ duration: 1, delay: 1 }}
           >
             <Button className="px-6 py-3 text-lg">Get Early Access</Button>
           </motion.div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
