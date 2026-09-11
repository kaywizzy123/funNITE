import { motion, AnimatePresence } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import FixtureCard from "../components/FixtureCard";

export default function Fixtures() {
  const { gameName, setGameName, err, setErr, players, setPlayers } =
    useContext(AppContext);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.25,
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

  return (
    <div className="flex justify-center flex-1 text-center mx-2 md:mx-0">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col m-4 w-full md:w-5xl gap-4 items-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold"
          >
            {gameName !== "" ? `${gameName}` : "Test Tournament"}
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="w-full  border rounded-2xl border-neutral-500/20 flex flex-col gap-4 overflow-auto p-4"
          >
            <p className="font-bold text-blue-500 text-2xl">Semi Final</p>
            <div className="flex justify-center items-center gap-2">
              <p className="text-neutral-500">1.</p>
              <FixtureCard />
            </div>
            <div className="flex justify-center items-center gap-2">
              <p className="text-neutral-500">2.</p>
              <FixtureCard />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="w-full border rounded-2xl border-neutral-500/20 flex flex-col gap-4 overflow-auto p-4"
          >
            <p className="font-bold text-blue-500 text-2xl">Final</p>
            <div className="flex justify-center items-center gap-2">
              <p className="text-neutral-500">3.</p>
              <FixtureCard />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
