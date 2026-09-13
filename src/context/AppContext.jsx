import { createContext, useEffect, useRef, useState } from "react";
import { advanceWinner } from "../utils/bracket";
import {
  advanceLBWinner,
  advanceWBLoserIntoLB,
  getRoundTypes,
} from "../utils/doubleElim";
import { createMatch } from "../utils/matchHelpers";
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
  const [losersRounds, setLosersRounds] = useState(initialTournament?.losersRounds ?? []);
  const [grandFinal, setGrandFinal] = useState(initialTournament?.grandFinal ?? null);
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
      losersRounds,
      grandFinal,
      format,
      mode,
      createdAt: createdAtRef.current ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [currentTournamentId, gameName, players, rounds, losersRounds, grandFinal, format, mode]);

  // Once both the winners-bracket champion and losers-bracket champion are
  // known, seed the grand final between them. Called from the winners/losers
  // submit handlers below (whichever one produces the second champion), and
  // a no-op once game1 already has its players.
  function seedGrandFinalIfReady(currentRounds, currentLosersRounds) {
    setGrandFinal((prev) => {
      if (!prev || (prev.game1.playerHome && prev.game1.playerAway)) return prev;
      const wbChampion = currentRounds.at(-1)?.[0]?.winner;
      const lbChampion = currentLosersRounds.at(-1)?.[0]?.winner;
      if (!wbChampion || !lbChampion) return prev;
      return { ...prev, game1: { ...prev.game1, playerHome: wbChampion, playerAway: lbChampion } };
    });
  }

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
  // `extra` carries the losers bracket + grand final shell for double elim.
  function generateFixtures(newRounds, extra = {}) {
    setCurrentTournamentId((prev) => {
      if (prev) return prev;
      createdAtRef.current = new Date().toISOString();
      return crypto.randomUUID();
    });
    setRounds(newRounds);
    setLosersRounds(extra.losersRounds ?? []);
    setGrandFinal(extra.grandFinal ?? null);
  }

  function loadTournament(tournament) {
    setGameName(tournament.gameName ?? "");
    setPlayers(tournament.players ?? defaultPlayers());
    setRounds(tournament.rounds ?? []);
    setLosersRounds(tournament.losersRounds ?? []);
    setGrandFinal(tournament.grandFinal ?? null);
    setFormat(tournament.format ?? "knockout");
    setMode(tournament.mode ?? "single");
    createdAtRef.current = tournament.createdAt ?? new Date().toISOString();
    setCurrentTournamentId(tournament.id);
  }

  function startNewTournament() {
    setGameName("");
    setPlayers(defaultPlayers());
    setRounds([]);
    setLosersRounds([]);
    setGrandFinal(null);
    setFormat("knockout");
    setMode("single");
    createdAtRef.current = null;
    setCurrentTournamentId(null);
  }

  function submitWinnersMatch(roundIndex, matchIndex, scoreHome, scoreAway) {
    if (scoreHome === scoreAway) return;
    const match = rounds[roundIndex][matchIndex];
    const winner = scoreHome > scoreAway ? match.playerHome : match.playerAway;
    const loser = winner === match.playerHome ? match.playerAway : match.playerHome;

    const nextRounds = advanceWinner(rounds, roundIndex, matchIndex, winner);
    nextRounds[roundIndex][matchIndex].scoreHome = scoreHome;
    nextRounds[roundIndex][matchIndex].scoreAway = scoreAway;

    const roundTypes = getRoundTypes(rounds.length);
    const nextLosersRounds = advanceWBLoserIntoLB(losersRounds, roundTypes, roundIndex, matchIndex, loser);

    setRounds(nextRounds);
    setLosersRounds(nextLosersRounds);
    seedGrandFinalIfReady(nextRounds, nextLosersRounds);
  }

  function submitLosersMatch(roundIndex, matchIndex, scoreHome, scoreAway) {
    if (scoreHome === scoreAway) return;
    const match = losersRounds[roundIndex][matchIndex];
    const winner = scoreHome > scoreAway ? match.playerHome : match.playerAway;

    const roundTypes = getRoundTypes(rounds.length);
    const nextLosersRounds = advanceLBWinner(losersRounds, roundTypes, roundIndex, matchIndex, winner);
    nextLosersRounds[roundIndex][matchIndex].scoreHome = scoreHome;
    nextLosersRounds[roundIndex][matchIndex].scoreAway = scoreAway;

    setLosersRounds(nextLosersRounds);
    seedGrandFinalIfReady(rounds, nextLosersRounds);
  }

  function submitGrandFinalMatch(game, scoreHome, scoreAway) {
    if (scoreHome === scoreAway) return;
    setGrandFinal((prev) => {
      const match = prev[game];
      const winner = scoreHome > scoreAway ? match.playerHome : match.playerAway;
      const next = { ...prev, [game]: { ...match, scoreHome, scoreAway, winner } };
      if (game === "game1") {
        const wbChampion = rounds.at(-1)?.[0]?.winner;
        if (winner.id !== wbChampion?.id) {
          next.game2 = createMatch(match.playerHome, match.playerAway);
        }
      }
      return next;
    });
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
        losersRounds,
        grandFinal,
        format,
        setFormat,
        mode,
        setMode,
        submitMatchResult,
        submitWinnersMatch,
        submitLosersMatch,
        submitGrandFinalMatch,
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
