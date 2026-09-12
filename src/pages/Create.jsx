import { useContext, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";
import PlayerDetails from "../components/PlayerDetails";
import { AnimatePresence, motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { generateBracket } from "../utils/bracket";
import { generateRoundRobin } from "../utils/roundRobin";
import { Link } from "react-router-dom";

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

export default function Create() {
  const {
    gameName,
    setGameName,
    err,
    setErr,
    players,
    setPlayers,
    setRounds,
    format,
    setFormat,
    mode,
    setMode,
  } = useContext(AppContext);

  useEffect(() => {
    if (!err) return;
    const timeout = setTimeout(() => setErr(""), 3000);
    return () => clearTimeout(timeout);
  }, [err, setErr, players]);

  function handleAdd() {
    setErr("");
    setPlayers((prevPlayers) => {
      return [
        ...prevPlayers,
        {
          id: crypto.randomUUID(),
          name: "",
          avatar: "",
        },
      ];
    });
  }

  function generateFixtures(event, players) {
    if (players.some((player) => player.name.trim() === "")) {
      event.preventDefault();
      setErr("Please enter a name for every player");
      return;
    }
    if (format === "league") {
      setRounds(generateRoundRobin(players, mode === "home_away"));
    } else {
      setRounds(generateBracket(players));
    }
  }

  return (
    <div className="flex justify-center flex-1 text-center mx-2 md:mx-0">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col m-4 w-full gap-4 items-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold"
          >
            Create New Game
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="flex flex-col w-full justify-center items-center"
          >
            <fieldset className="border border-neutral-50/6 bg-neutral-700/10 rounded-2xl w-full md:w-xl">
              <legend>Enter Players details</legend>

              <div className="flex flex-col gap-2 justify-center items-center m-5">
                <motion.div
                  variants={containerVariants}
                  className="w-full flex justify-between items-center gap-2 mb-3"
                >
                  <motion.div
                    variants={itemVariants}
                    className="relative w-full max-w-xs"
                  >
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full appearance-none rounded-full bg-blue-500 px-4 py-2.5 pr-10 text-sm text-neutral-50 shadow-sm transition-all focus:border-none focus:outline-none focus:ring-0 focus:ring-indigo-100"
                    >
                      <option value="knockout">Knockout</option>
                      <option value="league">League</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-50">
                      <ChevronDown size={18} />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="relative w-full max-w-xs"
                  >
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full appearance-none rounded-full bg-blue-500 px-4 py-2.5 pr-10 text-sm text-neutral-50 shadow-sm transition-all focus:border-none focus:outline-none focus:ring-0 focus:ring-indigo-100"
                    >
                      <option value="single">Single</option>
                      <option value="home_away">Home & Away</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-50">
                      <ChevronDown size={18} />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="bg-blue-500 rounded-full p-1 transition-all duration-300 hover:bg-blue-300 hover:scale-105 active:bg-blue-600 active:scale-95 cursor-pointer"
                    >
                      <Plus />
                    </button>
                  </motion.div>
                </motion.div>
                <AnimatePresence mode="popLayout">
                  {err && (
                    <motion.p
                      key={err}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-red-400"
                    >
                      {err}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                  variants={containerVariants}
                >
                  <motion.p
                    variants={itemVariants}
                    className="text-neutral-500"
                  >
                    Number of Players: {players.length}
                  </motion.p>
                </motion.div>
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
                  variants={containerVariants}
                  className="w-full flex justify-between gap-2 items-center p-2"
                >
                  <motion.label
                    variants={itemVariants}
                    htmlFor="gameName"
                    className="text-neutral-300"
                  >
                    Tournament name:{" "}
                  </motion.label>
                  <motion.input
                    variants={itemVariants}
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    className="flex-1 bg-neutral-700 rounded-full px-3 py-1.5 border border-neutral-500 outline-none"
                    placeholder="eg. Tim's birthday night clash..."
                  />
                </motion.div>
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
                  variants={containerVariants}
                  className="w-full flex flex-col py-2 gap-2 max-h-144 overflow-auto scrollbar-none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  <AnimatePresence mode="popLayout">
                    {players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        layout
                        variants={containerVariants}
                      >
                        <PlayerDetails
                          id={player.id}
                          name={player.name}
                          count={index + 1}
                          avatar={player.avatar}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </fieldset>
          </motion.div>
          <motion.div layout variants={itemVariants}>
            <AnimatePresence>
              <Link
                onClick={(e) => generateFixtures(e, players)}
                to="/fixtures"
                className="flex items-center justify-center gap-0.5 bg-blue-500 px-10 py-1.5 rounded-4xl transition-all duration-300 hover:scale-105 active:scale-95 text-2xl"
              >
                Generate Fixtures
              </Link>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
