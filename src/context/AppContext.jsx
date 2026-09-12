import { createContext, useState } from "react";
import { advanceWinner } from "../utils/bracket";

// eslint-disable-next-line react-refresh/only-export-components -- context + provider kept together on purpose
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [gameName, setGameName] = useState("");
  const [err, setErr] = useState("");
  const [players, setPlayers] = useState([
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
  ]);
  const [rounds, setRounds] = useState([]);

  function submitMatchResult(roundIndex, matchIndex, scoreHome, scoreAway) {
    if (scoreHome === scoreAway) return;

    setRounds((prevRounds) => {
      const match = prevRounds[roundIndex][matchIndex];
      const winner = scoreHome > scoreAway ? match.playerHome : match.playerAway;
      const nextRounds = advanceWinner(prevRounds, roundIndex, matchIndex, winner);
      nextRounds[roundIndex][matchIndex].scoreHome = scoreHome;
      nextRounds[roundIndex][matchIndex].scoreAway = scoreAway;
      return nextRounds;
    });
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
        submitMatchResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
