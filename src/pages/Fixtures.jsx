import { motion, AnimatePresence } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { getRoundLabel } from "../utils/bracket";
import FixtureCard from "../components/FixtureCard";

export default function Fixtures() {
  const { gameName, rounds, submitMatchResult } = useContext(AppContext);
  const finalMatch = rounds.at(-1)?.[0];

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
          <motion.h2
            variants={itemVariants}
            className="text-2xl text-blue-500 font-bold"
          >
            Fixtures
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-full  border rounded-2xl border-neutral-500/20 flex flex-col gap-4 overflow-auto p-4"
          >
            {finalMatch?.winner && (
              <p className="font-semibold text-yellow-400 text-2xl">
                🏆 Champion: {finalMatch.winner.name}
              </p>
            )}

            {rounds.map((round, roundIndex) => (
              <div
                key={roundIndex}
                className="flex flex-col bg-neutral-700/10 gap-2 p-4 rounded-2xl"
              >
                <p className="font-semibold text-blue-500 text-2xl">
                  {getRoundLabel(round.length)}
                </p>

                {round.map((match, matchIndex) => (
                  <div
                    key={match.id}
                    className="flex justify-center items-center gap-2"
                  >
                    <p className="text-neutral-500">{matchIndex + 1}.</p>
                    <FixtureCard
                      playerHome={match.playerHome}
                      playerAway={match.playerAway}
                      scoreHome={match.scoreHome}
                      scoreAway={match.scoreAway}
                      onSubmit={(scoreHome, scoreAway) =>
                        submitMatchResult(
                          roundIndex,
                          matchIndex,
                          scoreHome,
                          scoreAway,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
