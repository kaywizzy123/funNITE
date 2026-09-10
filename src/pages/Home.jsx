import { Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center flex-1 text-center mx-2 md:mx-0">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center items-center gap-4"
        >
          <motion.div variants={itemVariants}>
            <motion.div
              animate={{
                scale: [1, 1.3, 1.3, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                color: ["#93c5fd", "#3b82f6", "#3b82f6", "#93c5fd", "#93c5fd"],
              }}
              transition={{
                delay: 0.85,
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Gamepad2 size={148} className="transition-all duration-300" />
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-blue-500"
          >
            Welcome to funNITE
          </motion.h1>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl text-blue-300"
          >
            The Ultimate AI Powered Fixtures Generator
          </motion.h2>
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl text-neutral-400"
          >
            Ditch the Paper. Track the Bragging Rights
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-md text-neutral-500"
          >
            Generate Instant game fixtures, live round-robin pairings, and
            automatedd couch leaderboards for your local gaming nights
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-md text-neutral-600"
          >
            Leave the planning to AI, Focus on the game and have fun.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/create"
              className="flex items-center gap-0.5 bg-blue-500 px-15 py-3.5 rounded-4xl transition-all duration-300 hover:scale-105 active:scale-95 text-2xl"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
