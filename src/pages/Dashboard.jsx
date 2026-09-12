import { useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Trophy } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { loadTournaments } from "../utils/storage";
import { getTournamentChampion, getTournamentStatus } from "../utils/tournamentStatus";
import { containerVariants, itemVariants } from "../utils/motionVariants";

const STATUS_LABEL = {
  draft: "Draft",
  in_progress: "In Progress",
  completed: "Completed",
};

const STATUS_STYLE = {
  draft: "bg-neutral-700 text-neutral-300",
  in_progress: "bg-blue-500/20 text-blue-300",
  completed: "bg-yellow-500/20 text-yellow-300",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Dashboard() {
  const { loadTournament, startNewTournament, requestDeleteTournament } =
    useContext(AppContext);
  const [tournaments, setTournaments] = useState(loadTournaments);
  const navigate = useNavigate();

  const sorted = useMemo(
    () => [...tournaments].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [tournaments],
  );

  function handleCreateNew() {
    startNewTournament();
    navigate("/create");
  }

  function handleOpen(tournament) {
    loadTournament(tournament);
    navigate(getTournamentStatus(tournament) === "draft" ? "/create" : "/fixtures");
  }

  function handleDelete(event, id) {
    event.stopPropagation();
    requestDeleteTournament(id, () => {
      setTournaments((prev) => prev.filter((t) => t.id !== id));
    });
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
          <motion.div
            variants={itemVariants}
            className="flex w-full justify-between items-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold">Dashboard</h1>
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex items-center gap-1 bg-blue-500 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus size={16} /> Create New
            </button>
          </motion.div>

          {sorted.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="w-full border border-dashed border-neutral-500/30 rounded-2xl p-10 flex flex-col gap-3 items-center"
            >
              <p className="text-neutral-400">No tournaments yet.</p>
              <Link
                to="/create"
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateNew();
                }}
                className="bg-blue-500 px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Start your first tournament
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {sorted.map((tournament) => {
                  const status = getTournamentStatus(tournament);
                  const champion =
                    status === "completed" ? getTournamentChampion(tournament) : null;
                  return (
                    <motion.div
                      key={tournament.id}
                      layout
                      variants={itemVariants}
                      onClick={() => handleOpen(tournament)}
                      className="text-left cursor-pointer bg-neutral-700/10 border border-neutral-500/20 rounded-2xl p-4 flex flex-col gap-2 transition-all duration-300 hover:border-blue-500/50"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-lg">
                          {tournament.gameName || "Untitled Tournament"}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[status]}`}
                        >
                          {STATUS_LABEL[status]}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400">
                        {tournament.format === "league" ? "League" : "Knockout"} ·{" "}
                        {tournament.players?.length ?? 0} players
                      </p>
                      {champion && (
                        <p className="text-sm text-yellow-400 flex items-center gap-1">
                          <Trophy size={14} /> {champion.name}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-neutral-500">
                          Updated {formatDate(tournament.updatedAt)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, tournament.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          aria-label="Delete tournament"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
