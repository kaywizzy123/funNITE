import { computeStandings, isLeagueComplete } from "./standings";

export function getTournamentChampion({ format, rounds }) {
  if (!rounds || rounds.length === 0) return null;
  if (format === "league") {
    return isLeagueComplete(rounds) ? (computeStandings(rounds)[0]?.player ?? null) : null;
  }
  return rounds.at(-1)?.[0]?.winner ?? null;
}

export function getTournamentStatus(tournament) {
  if (!tournament.rounds || tournament.rounds.length === 0) return "draft";
  return getTournamentChampion(tournament) ? "completed" : "in_progress";
}
