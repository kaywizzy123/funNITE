import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { User } from "lucide-react";
import { motion } from "motion/react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function FixtureCard() {
  const { gameName, setGameName, err, setErr, players, setPlayers } =
    useContext(AppContext);

  const [inputHome, setInputHome] = useState();
  const [inputAway, setInputAway] = useState();

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4 items-stretch sm:items-center bg-neutral-500/10 border border-neutral-500/30 rounded-2xl p-4 sm:p-4 transition-colors duration-300 hover:border-neutral-500/50"
    >
      <div className="flex flex-1 gap-3 items-center justify-center sm:justify-end bg-neutral-950 border border-neutral-500/40 rounded-2xl py-2.5 px-4">
        <p className="order-2 sm:order-1 font-medium truncate">Player 1</p>
        <div className="order-1 sm:order-2 flex shrink-0 justify-center items-center w-10 h-10 bg-neutral-300/30 border border-neutral-400/70 rounded-full">
          <User className="text-neutral-400" size={18} />
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 shrink-0 self-center bg-neutral-950 border border-neutral-500/40 rounded-2xl py-2 px-3">
        <input
          className="w-9 h-9 text-center font-semibold bg-neutral-800/60 border border-neutral-500/40 rounded-xl outline-none transition-shadow focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number"
          value={inputHome}
          onChange={(e) => setInputHome(e.target.value)}
        />
        <p className="text-neutral-500 font-semibold">-</p>
        <input
          className="w-9 h-9 text-center font-semibold bg-neutral-800/60 border border-neutral-500/40 rounded-xl outline-none transition-shadow focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number"
          value={inputAway}
          onChange={(e) => setInputAway(e.target.value)}
        />
      </div>

      <div className="flex flex-1 gap-3 items-center justify-center sm:justify-start bg-neutral-950 border border-neutral-500/40 rounded-2xl py-2.5 px-4">
        <div className="flex shrink-0 justify-center items-center w-10 h-10 bg-neutral-300/30 border border-neutral-400/70 rounded-full">
          <User className="text-neutral-400" size={18} />
        </div>
        <p className="font-medium truncate">Player 2</p>
      </div>
    </motion.div>
  );
}
