import { computeStandings, isLeagueComplete } from "./standings";
import { getDoubleElimChampion } from "./doubleElim";

export function getTournamentChampion({ format, rounds, losersRounds, grandFinal }) {
  if (!rounds || rounds.length === 0) return null;
  if (format === "league") {
    return isLeagueComplete(rounds) ? (computeStandings(rounds)[0]?.player ?? null) : null;
  }
  if (format === "double_elim") {
    if (!losersRounds || !grandFinal) return null;
    return getDoubleElimChampion({ winnersRounds: rounds, losersRounds, grandFinal });
  }
  return rounds.at(-1)?.[0]?.winner ?? null;
}

export function getTournamentStatus(tournament) {
  if (!tournament.rounds || tournament.rounds.length === 0) return "draft";
  return getTournamentChampion(tournament) ? "completed" : "in_progress";
}
