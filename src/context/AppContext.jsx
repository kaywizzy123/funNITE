import { createContext, useEffect, useRef, useState } from "react";
import { advanceWinner } from "../utils/bracket";
import { loadTournamentState, saveTournamentState } from "../utils/storage";

// eslint-disable-next-line react-refresh/only-export-components -- context + provider kept together on purpose
export const AppContext = createContext();

export function AppProvider({ children }) {
  const persisted = loadTournamentState();

  const [gameName, setGameName] = useState(persisted?.gameName ?? "");
  const [err, setErr] = useState("");
  const [players, setPlayers] = useState(
    persisted?.players ?? [
      { id: crypto.randomUUID(), name: "" },
      { id: crypto.randomUUID(), name: "" },
      { id: crypto.randomUUID(), name: "" },
    ],
  );
  const [rounds, setRounds] = useState(persisted?.rounds ?? []);
  const [format, setFormat] = useState(persisted?.format ?? "knockout");
  const [mode, setMode] = useState(persisted?.mode ?? "single");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const pendingResetRef = useRef(null);

  useEffect(() => {
    saveTournamentState({ gameName, players, rounds, format, mode });
  }, [gameName, players, rounds, format, mode]);

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

  function resetTournament() {
    setGameName("");
    setPlayers([
      { id: crypto.randomUUID(), name: "" },
      { id: crypto.randomUUID(), name: "" },
      { id: crypto.randomUUID(), name: "" },
    ]);
    setRounds([]);
    setFormat("knockout");
    setMode("single");
  }

  function requestReset(onConfirmed) {
    if (rounds.length === 0) {
      resetTournament();
      onConfirmed?.();
      return;
    }
    pendingResetRef.current = onConfirmed;
    setResetModalOpen(true);
  }

  function confirmResetModal() {
    resetTournament();
    setResetModalOpen(false);
    pendingResetRef.current?.();
    pendingResetRef.current = null;
  }

  function cancelResetModal() {
    setResetModalOpen(false);
    pendingResetRef.current = null;
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
        setRounds,
        format,
        setFormat,
        mode,
        setMode,
        submitMatchResult,
        requestReset,
        resetModalOpen,
        confirmResetModal,
        cancelResetModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
