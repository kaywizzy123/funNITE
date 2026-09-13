import { motion, AnimatePresence } from "motion/react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getRoundLabel } from "../utils/bracket";
import { getMatchdayLabel } from "../utils/roundRobin";
import { computeStandings } from "../utils/standings";
import { getTournamentChampion } from "../utils/tournamentStatus";
import { decodeShareData } from "../utils/shareEncode";
import { containerVariants, itemVariants } from "../utils/motionVariants";
import FixtureCard from "../components/FixtureCard";
import StandingsTable from "../components/StandingsTable";

export default function SharedView() {
  const { encoded } = useParams();
  const data = useMemo(() => decodeShareData(encoded), [encoded]);

  if (!data) {
    return (
      <div className="flex justify-center flex-1 text-center mx-2 md:mx-0">
        <div className="flex flex-col m-4 gap-4 items-center">
          <h1 className="text-2xl font-bold">This link is invalid or corrupted</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to funNITE
          </Link>
        </div>
      </div>
    );
  }

  const { gameName, format, rounds } = data;
  const isLeague = format === "league";
  const standings = isLeague ? computeStandings(rounds) : [];
  const champion = getTournamentChampion({ format, rounds });

  return (
    <div className="flex justify-center flex-1 text-center mx-2 md:mx-0">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col m-4 w-full md:w-5xl gap-4 items-center"
        >
          <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-bold">
            {gameName || "Untitled Tournament"}
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-2xl text-blue-500 font-bold">
            Fixtures
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm text-neutral-500">
            Shared results &middot; read-only
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="w-full border rounded-2xl border-neutral-500/20 flex flex-col gap-4 overflow-auto p-4"
          >
            {champion && (
              <p className="font-semibold text-yellow-400 text-2xl">
                🏆 Champion: {champion.name}
              </p>
            )}

            {isLeague && <StandingsTable standings={standings} />}

            {rounds.map((round, roundIndex) => (
              <div
                key={roundIndex}
                className="flex flex-col bg-neutral-700/10 gap-2 p-4 rounded-2xl"
              >
                <p className="font-semibold text-blue-500 text-2xl">
                  {isLeague ? getMatchdayLabel(roundIndex) : getRoundLabel(round.length)}
                </p>

                {round.map((match, matchIndex) => (
                  <div key={match.id} className="flex justify-center items-center gap-2">
                    <p className="text-neutral-500">{matchIndex + 1}.</p>
                    <FixtureCard
                      playerHome={match.playerHome}
                      playerAway={match.playerAway}
                      scoreHome={match.scoreHome}
                      scoreAway={match.scoreAway}
                      readOnly
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
