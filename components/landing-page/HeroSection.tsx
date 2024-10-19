import { motion, AnimatePresence } from "framer-motion";

const fadeInTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const ConcentricCircles = () => {
  return (
    <div className="flex justify-center mb-24">
      <div className="relative w-56 h-56">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 1, delay: 1 }}
          className="absolute inset-0 rounded-full bg-pink-500"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-purple-500"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 1 }}
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-500"
        />
      </div>
    </div>
  );
};

export default ConcentricCircles;

export function HeroSection({ isDrawerOpen }: { isDrawerOpen: boolean }) {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInTransition}
            transition={{ duration: 0.5 }}
            className="max-w-3xl px-4"
          >
            <ConcentricCircles />
            <motion.h1
              className="mb-6 text-6xl font-bold tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeInTransition}
              transition={{ duration: 1 }}
            >
              from IDENTITY
            </motion.h1>
            <motion.h1
              className="my-6 text-6xl font-bold tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeInTransition}
              transition={{ duration: 1, delay: 0.5 }}
            >
              to BEHAVIOR
            </motion.h1>

            <motion.h1
              className="my-6 text-6xl font-bold tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeInTransition}
              transition={{ duration: 1, delay: 1 }}
            >
              and ACTIONS
            </motion.h1>

            <motion.p
              className="mb-8 text-xl text-muted-foreground"
              initial="hidden"
              animate="visible"
              variants={fadeInTransition}
              transition={{ duration: 1, delay: 1.5 }}
            >
              {/* Track progress, align goals, and create lasting change. */}
              build the best version of yourself.
            </motion.p>
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
      {/* <motion.div
       className="absolute inset-0 z-0"
       style={{
         backgroundImage:
           "url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?text=Abstract+Background')",
         backgroundSize: "cover",
         backgroundPosition: "center",
         opacity: 0.09,
         transform: `translateY(${scrollY * 0.5}px)`,
       }}
     /> */}
    </section>
  );
}
