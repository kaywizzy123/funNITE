import { createMatch, shuffle } from "./matchHelpers";

export function generateRoundRobin(players, doubleRound = false) {
  if (players.length < 2) return [];

  let roster = shuffle(players);
  const hasBye = roster.length % 2 !== 0;
  if (hasBye) {
    roster = [...roster, { id: crypto.randomUUID(), name: "Bye", avatar: null }];
  }

  const n = roster.length;
  const numRounds = n - 1;
  const half = n / 2;
  let arr = [...roster];
  const rounds = [];

  for (let r = 0; r < numRounds; r++) {
    const matches = [];
    for (let i = 0; i < half; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a.name === "Bye" || b.name === "Bye") continue;
      const [home, away] = r % 2 === 0 ? [a, b] : [b, a];
      matches.push(createMatch(home, away));
    }
    if (matches.length > 0) rounds.push(matches);
    arr = [arr[0], arr[n - 1], ...arr.slice(1, n - 1)];
  }

  if (!doubleRound) return rounds;

  const secondLeg = rounds.map((round) =>
    round.map((match) => createMatch(match.playerAway, match.playerHome)),
  );
  return [...rounds, ...secondLeg];
}

export function getMatchdayLabel(roundIndex) {
  return `Matchday ${roundIndex + 1}`;
}
