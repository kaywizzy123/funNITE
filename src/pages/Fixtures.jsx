import { motion, AnimatePresence } from "motion/react";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Pencil, X } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { getRoundLabel } from "../utils/bracket";
import { getMatchdayLabel } from "../utils/roundRobin";
import { getLosersRoundLabel } from "../utils/doubleElim";
import { computeStandings } from "../utils/standings";
import { getTournamentChampion } from "../utils/tournamentStatus";
import { encodeShareData } from "../utils/shareEncode";
import { containerVariants, itemVariants } from "../utils/motionVariants";
import FixtureCard from "../components/FixtureCard";
import StandingsTable from "../components/StandingsTable";
import ShareMenu from "../components/ShareMenu";

export default function Fixtures() {
  const {
    gameName,
    setGameName,
    rounds,
    losersRounds,
    grandFinal,
    submitMatchResult,
    submitWinnersMatch,
    submitLosersMatch,
    submitGrandFinalMatch,
    format,
    mode,
    currentTournamentId,
    requestDeleteTournament,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const isLeague = format === "league";
  const isDoubleElim = format === "double_elim";
  const standings = isLeague ? computeStandings(rounds) : [];
  const champion = getTournamentChampion({ format, rounds, losersRounds, grandFinal });
  const resultsRef = useRef(null);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(gameName);

  function startEditingName() {
    setNameDraft(gameName);
    setEditingName(true);
  }

  function commitName() {
    setGameName(nameDraft.trim());
    setEditingName(false);
  }

  function cancelEditingName() {
    setEditingName(false);
  }

  return (
    <div className="flex justify-center flex-1 text-center mx-2 md:mx-0">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col m-4 w-full md:w-5xl gap-4 items-center"
        >
          {editingName ? (
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitName();
                  if (e.key === "Escape") cancelEditingName();
                }}
                className="text-3xl md:text-5xl font-bold bg-transparent border-b border-blue-500 outline-none text-center max-w-full"
              />
              <button
                type="button"
                onClick={commitName}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                aria-label="Save tournament name"
              >
                <Check size={22} />
              </button>
              <button
                type="button"
                onClick={cancelEditingName}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
                aria-label="Cancel editing tournament name"
              >
                <X size={22} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 group"
            >
              <h1 className="text-3xl md:text-5xl font-bold">
                {gameName !== "" ? gameName : "Test Tournament"}
              </h1>
              <button
                type="button"
                onClick={startEditingName}
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="Edit tournament name"
              >
                <Pencil size={18} />
              </button>
            </motion.div>
          )}
          <motion.h2
            variants={itemVariants}
            className="text-2xl text-blue-500 font-bold"
          >
            Fixtures
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <Link
              to="/dashboard"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <button
              type="button"
              onClick={() =>
                requestDeleteTournament(currentTournamentId, () => navigate("/create"))
              }
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Delete Tournament
            </button>
            <ShareMenu
              targetRef={resultsRef}
              getShareUrl={() =>
                `${window.location.origin}/share/${encodeShareData({ gameName, format, mode, rounds, losersRounds, grandFinal })}`
              }
              fileName={gameName || "tournament-results"}
            />
          </motion.div>
          <motion.div
            ref={resultsRef}
            variants={itemVariants}
            className="w-full  border rounded-2xl border-neutral-500/20 flex flex-col gap-4 overflow-auto p-4"
          >
            {champion && (
              <p className="font-semibold text-yellow-400 text-2xl">
                🏆 Champion: {champion.name}
              </p>
            )}

            {isLeague && <StandingsTable standings={standings} />}

            {isDoubleElim && (
              <p className="font-bold text-xl text-neutral-300">Winners Bracket</p>
            )}

            {rounds.map((round, roundIndex) => (
              <div
                key={roundIndex}
                className="flex flex-col bg-neutral-700/10 gap-2 p-4 rounded-2xl"
              >
                <p className="font-semibold text-blue-500 text-2xl">
                  {isDoubleElim
                    ? `Winners ${getRoundLabel(round.length)}`
                    : isLeague
                      ? getMatchdayLabel(roundIndex)
                      : getRoundLabel(round.length)}
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
                      allowTies={isLeague}
                      onSubmit={(scoreHome, scoreAway) =>
                        isDoubleElim
                          ? submitWinnersMatch(roundIndex, matchIndex, scoreHome, scoreAway)
                          : submitMatchResult(roundIndex, matchIndex, scoreHome, scoreAway)
                      }
                    />
                  </div>
                ))}
              </div>
            ))}

            {isDoubleElim && (
              <>
                <p className="font-bold text-xl text-neutral-300">Losers Bracket</p>
                {losersRounds.map((round, roundIndex) => (
                  <div
                    key={`lb-${roundIndex}`}
                    className="flex flex-col bg-neutral-700/10 gap-2 p-4 rounded-2xl"
                  >
                    <p className="font-semibold text-blue-500 text-2xl">
                      {getLosersRoundLabel(roundIndex, losersRounds.length)}
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
                            submitLosersMatch(roundIndex, matchIndex, scoreHome, scoreAway)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ))}

                {grandFinal?.game1?.playerHome && grandFinal.game1.playerAway && (
                  <div className="flex flex-col bg-neutral-700/10 gap-2 p-4 rounded-2xl">
                    <p className="font-semibold text-blue-500 text-2xl">Grand Final</p>
                    <div className="flex justify-center items-center gap-2">
                      <FixtureCard
                        playerHome={grandFinal.game1.playerHome}
                        playerAway={grandFinal.game1.playerAway}
                        scoreHome={grandFinal.game1.scoreHome}
                        scoreAway={grandFinal.game1.scoreAway}
                        onSubmit={(scoreHome, scoreAway) =>
                          submitGrandFinalMatch("game1", scoreHome, scoreAway)
                        }
                      />
                    </div>

                    {grandFinal.game2 && (
                      <>
                        <p className="font-semibold text-blue-500 text-2xl">
                          Grand Final: Bracket Reset
                        </p>
                        <div className="flex justify-center items-center gap-2">
                          <FixtureCard
                            playerHome={grandFinal.game2.playerHome}
                            playerAway={grandFinal.game2.playerAway}
                            scoreHome={grandFinal.game2.scoreHome}
                            scoreAway={grandFinal.game2.scoreAway}
                            onSubmit={(scoreHome, scoreAway) =>
                              submitGrandFinalMatch("game2", scoreHome, scoreAway)
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
