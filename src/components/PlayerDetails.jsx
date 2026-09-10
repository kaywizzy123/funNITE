import { Minus, User } from "lucide-react";
import { motion } from "motion/react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export default function PlayerDetails({
  id,
  name,
  count,
  players,
  setPlayers,
  setErr,
  avatar,
}) {
  function handleDelete(id) {
    if (players.length === 3) {
      setErr("You can't create a fixtures with less than 3 players");
      return null;
    }

    setErr("");
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  }

  function handleChange(value) {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id
          ? { ...player, name: value, avatar: value.charAt(0).toUpperCase() }
          : player,
      ),
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      exit="exit"
      layout
      className="flex justify-between items-center gap-2 w-full px-0.5"
    >
      <p className="flex justify-center items-center w-8 h-8 text-neutral-600 text-lg">
        {count}.
      </p>
      <input
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        className="flex-1 bg-neutral-50/10  rounded-4xl px-3.5 py-2 outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={`Enter player ${count} name...`}
      />
      <div className="flex justify-center items-center w-10 h-10 bg-neutral-300/30 border border-neutral-400/70 rounded-full ">
        {name !== "" ? avatar : <User className="text-neutral-400" />}
      </div>
      <div
        onClick={() => handleDelete(id)}
        className="flex justify-center items-center w-6 h-6 transition-all duration-300 rounded-full bg-red-500 hover:scale-115 active:scale-95 hover:bg-red-700 active:bg-red-300"
      >
        <Minus size={20} />
      </div>
    </motion.div>
  );
}
