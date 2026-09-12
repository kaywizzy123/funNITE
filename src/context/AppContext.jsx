import { createContext, useEffect, useRef, useState } from "react";
import { advanceWinner } from "../utils/bracket";
import {
  deleteTournamentById,
  loadCurrentTournamentId,
  loadTournaments,
  saveCurrentTournamentId,
  upsertTournament,
} from "../utils/storage";

// eslint-disable-next-line react-refresh/only-export-components -- context + provider kept together on purpose
export const AppContext = createContext();

function defaultPlayers() {
  return [
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
  ];
}

export function AppProvider({ children }) {
  const [initialTournament] = useState(() => {
    const id = loadCurrentTournamentId();
    return loadTournaments().find((t) => t.id === id) ?? null;
  });

  const [currentTournamentId, setCurrentTournamentId] = useState(initialTournament?.id ?? null);
  const [gameName, setGameName] = useState(initialTournament?.gameName ?? "");
  const [err, setErr] = useState("");
  const [players, setPlayers] = useState(initialTournament?.players ?? defaultPlayers());
  const [rounds, setRounds] = useState(initialTournament?.rounds ?? []);
  const [format, setFormat] = useState(initialTournament?.format ?? "knockout");
  const [mode, setMode] = useState(initialTournament?.mode ?? "single");
  const createdAtRef = useRef(initialTournament?.createdAt ?? null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const pendingDeleteIdRef = useRef(null);
  const pendingConfirmRef = useRef(null);

  useEffect(() => {
    saveCurrentTournamentId(currentTournamentId);
  }, [currentTournamentId]);

  // Autosave the working fields to storage once a tournament actually
  // exists (i.e. has an id). Nothing is written while the user is still
  // filling out a brand-new /create form with no id yet.
  useEffect(() => {
    if (!currentTournamentId) return;
    upsertTournament({
      id: currentTournamentId,
      gameName,
      players,
      rounds,
      format,
      mode,
      createdAt: createdAtRef.current ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [currentTournamentId, gameName, players, rounds, format, mode]);

  function submitMatchResult(roundIndex, matchIndex, scoreHome, scoreAway) {
    if (format !== "league") {
      if (scoreHome === scoreAway) return;

      setRounds((prevRounds) => {
        const match = prevRounds[roundIndex][matchIndex];
        const winner = scoreHome > scoreAway ? match.playerHome : match.playerAway;
        const nextRounds = advanceWinner(prevRounds, roundIndex, matchIndex, winner);
        nextRounds[roundIndex][matchIndex].scoreHome = scoreHome;
        nextRounds[roundIndex][matchIndex].scoreAway = scoreAway;
        return nextRounds;
      });
      return;
    }

    setRounds((prevRounds) => {
      const nextRounds = prevRounds.map((round) => round.map((m) => ({ ...m })));
      const match = nextRounds[roundIndex][matchIndex];
      match.scoreHome = scoreHome;
      match.scoreAway = scoreAway;
      match.winner =
        scoreHome === scoreAway
          ? null
          : scoreHome > scoreAway
            ? match.playerHome
            : match.playerAway;
      return nextRounds;
    });
  }

  // Called by Create.jsx instead of setRounds directly. Mints an id on the
  // first save (rounds [] -> non-empty); preserves an already-loaded id
  // (e.g. resuming a draft and generating its fixtures for the first time).
  function generateFixtures(newRounds) {
    setCurrentTournamentId((prev) => {
      if (prev) return prev;
      createdAtRef.current = new Date().toISOString();
      return crypto.randomUUID();
    });
    setRounds(newRounds);
  }

  function loadTournament(tournament) {
    setGameName(tournament.gameName ?? "");
    setPlayers(tournament.players ?? defaultPlayers());
    setRounds(tournament.rounds ?? []);
    setFormat(tournament.format ?? "knockout");
    setMode(tournament.mode ?? "single");
    createdAtRef.current = tournament.createdAt ?? new Date().toISOString();
    setCurrentTournamentId(tournament.id);
  }

  function startNewTournament() {
    setGameName("");
    setPlayers(defaultPlayers());
    setRounds([]);
    setFormat("knockout");
    setMode("single");
    createdAtRef.current = null;
    setCurrentTournamentId(null);
  }

  function deleteTournament(id) {
    deleteTournamentById(id);
    if (id === currentTournamentId) {
      startNewTournament();
    }
  }

  function requestDeleteTournament(id, onConfirmed) {
    pendingDeleteIdRef.current = id;
    pendingConfirmRef.current = onConfirmed;
    setDeleteModalOpen(true);
  }

  function confirmDeleteTournament() {
    const id = pendingDeleteIdRef.current;
    if (id) deleteTournament(id);
    setDeleteModalOpen(false);
    pendingConfirmRef.current?.();
    pendingDeleteIdRef.current = null;
    pendingConfirmRef.current = null;
  }

  function cancelDeleteModal() {
    setDeleteModalOpen(false);
    pendingDeleteIdRef.current = null;
    pendingConfirmRef.current = null;
  }

  return (
    <AppContext.Provider
      value={{
        gameName,
        setGameName,
        err,
        setErr,
        players,
        setPlayers,
        rounds,
        format,
        setFormat,
        mode,
        setMode,
        submitMatchResult,
        currentTournamentId,
        generateFixtures,
        loadTournament,
        startNewTournament,
        deleteTournament,
        deleteModalOpen,
        requestDeleteTournament,
        confirmDeleteTournament,
        cancelDeleteModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
