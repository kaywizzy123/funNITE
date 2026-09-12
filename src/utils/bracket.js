import { shuffle, createMatch } from "./matchHelpers";

function nextPowerOfTwo(n) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

function placeWinner(rounds, roundIndex, matchIndex, winner) {
  if (roundIndex + 1 >= rounds.length) return;

  const nextMatch = rounds[roundIndex + 1][Math.floor(matchIndex / 2)];
  if (matchIndex % 2 === 0) {
    nextMatch.playerHome = winner;
  } else {
    nextMatch.playerAway = winner;
  }
}

export function generateBracket(players) {
  const bracketSize = nextPowerOfTwo(players.length);
  const numMatches = bracketSize / 2;
  const byesNeeded = bracketSize - players.length;
  const shuffled = shuffle(players);

  const round1 = [];
  let cursor = 0;
  for (let i = 0; i < byesNeeded; i++) {
    const playerHome = shuffled[cursor++];
    round1.push(createMatch(playerHome, { id: crypto.randomUUID(), name: "Bye", avatar: null }, playerHome));
  }
  for (let i = byesNeeded; i < numMatches; i++) {
    round1.push(createMatch(shuffled[cursor++], shuffled[cursor++]));
  }

  const rounds = [round1];
  for (let size = numMatches / 2; size >= 1; size /= 2) {
    rounds.push(Array.from({ length: size }, () => createMatch()));
  }

  round1.forEach((match, matchIndex) => {
    if (match.winner) placeWinner(rounds, 0, matchIndex, match.winner);
  });

  return rounds;
}

export function advanceWinner(rounds, roundIndex, matchIndex, winner) {
  const nextRounds = rounds.map((round) => round.map((match) => ({ ...match })));
  nextRounds[roundIndex][matchIndex].winner = winner;
  placeWinner(nextRounds, roundIndex, matchIndex, winner);
  return nextRounds;
}

export function getRoundLabel(matchCount) {
  if (matchCount === 1) return "Final";
  if (matchCount === 2) return "Semifinal";
  if (matchCount === 4) return "Quarter Final";
  return `Round of ${matchCount * 2}`;
}
