import { createMatch } from "./matchHelpers";
import { generateBracket } from "./bracket";

function isBye(player) {
  return player?.name === "Bye";
}

function byePlaceholder() {
  return { id: crypto.randomUUID(), name: "Bye", avatar: null };
}

function isByeMatch(match) {
  return isBye(match.playerHome) || isBye(match.playerAway);
}

// Resolves a losers-bracket pairing. Only ever auto-decides a winner when
// both sides are already known AND at least one is a bye placeholder —
// everything else (an unknown/pending slot on either side) stays a match
// waiting on a real result.
function resolvePair(a, b) {
  if (a && b) {
    if (isBye(a) && isBye(b)) return { match: createMatch(a, b, a), winner: a };
    if (isBye(a)) return { match: createMatch(a, b, b), winner: b };
    if (isBye(b)) return { match: createMatch(a, b, a), winner: a };
    return { match: createMatch(a, b), winner: null };
  }
  return { match: createMatch(a ?? null, b ?? null), winner: null };
}

function pairAmongSelves(list) {
  const round = [];
  const winners = [];
  for (let i = 0; i < list.length; i += 2) {
    const { match, winner } = resolvePair(list[i], list[i + 1]);
    round.push(match);
    winners.push(winner);
  }
  return { round, winners };
}

function pairAcross(listA, listB) {
  const round = [];
  const winners = [];
  for (let i = 0; i < listA.length; i++) {
    const { match, winner } = resolvePair(listA[i], listB[i]);
    round.push(match);
    winners.push(winner);
  }
  return { round, winners };
}

// Describes, for each losers-bracket round in generation order, whether it
// pairs survivors among themselves ("round1"/"survive") or merges them with
// a fresh batch of winners-bracket losers ("drop"). Every routing decision
// below is derived from this shape.
function buildRoundTypes(k) {
  const types = ["round1"];
  for (let r = 2; r <= k; r++) {
    types.push("drop");
    if (r < k) types.push("survive");
  }
  return types;
}

export function getRoundTypes(k) {
  return buildRoundTypes(k);
}

export function getLosersRoundLabel(roundIndex, totalRounds) {
  if (roundIndex === totalRounds - 1) return "Losers Final";
  return `Losers Round ${roundIndex + 1}`;
}

export function generateDoubleElimination(players) {
  const winnersRounds = generateBracket(players);
  const k = winnersRounds.length;

  const losersRounds = [];

  // Losers Round 1: pair up the losers of winners-bracket round 1. A
  // winners-bracket bye never produces a real loser, so it drops a phantom
  // bye into this round instead — that phantom then auto-advances (or
  // cascades further) exactly like a real bye would.
  const round1Slots = winnersRounds[0].map((match) => (isByeMatch(match) ? byePlaceholder() : null));
  let { round, winners } = pairAmongSelves(round1Slots);
  losersRounds.push(round);

  for (let r = 2; r <= k; r++) {
    const wbCount = winnersRounds[r - 1].length;
    const survivorSlots = Array.from({ length: wbCount }, (_, i) => winners[i] ?? null);
    const wbLoserSlots = Array.from({ length: wbCount }, () => null);
    ({ round, winners } = pairAcross(survivorSlots, wbLoserSlots));
    losersRounds.push(round);

    if (r < k) {
      ({ round, winners } = pairAmongSelves(winners));
      losersRounds.push(round);
    }
  }

  return {
    winnersRounds,
    losersRounds,
    grandFinal: { game1: createMatch(), game2: null },
  };
}

function dropRoundIndexForWbRound(wbRoundIndex) {
  // wbRoundIndex is 0-based; winners-bracket round r (1-based) = wbRoundIndex + 1.
  return 2 * wbRoundIndex - 1;
}

function cloneLosersRounds(losersRounds) {
  return losersRounds.map((round) => round.map((match) => ({ ...match })));
}

// Places `player` into one slot of a losers-bracket match. If that completes
// the match against an already-known bye, the winner is decided immediately
// and forwarded on — recursing for as long as byes keep cascading.
function placeAndResolve(losersRounds, roundTypes, roundIndex, matchIndex, slot, player) {
  const next = cloneLosersRounds(losersRounds);
  const match = next[roundIndex][matchIndex];
  match[slot] = player;

  if (match.winner == null && match.playerHome && match.playerAway) {
    if (isBye(match.playerHome) && isBye(match.playerAway)) {
      match.winner = match.playerHome;
    } else if (isBye(match.playerHome)) {
      match.winner = match.playerAway;
    } else if (isBye(match.playerAway)) {
      match.winner = match.playerHome;
    }
  }

  if (match.winner != null && roundIndex < roundTypes.length - 1) {
    return advanceLBWinner(next, roundTypes, roundIndex, matchIndex, match.winner);
  }
  return next;
}

export function advanceLBWinner(losersRounds, roundTypes, roundIndex, matchIndex, winner) {
  const withWinner = cloneLosersRounds(losersRounds);
  withWinner[roundIndex][matchIndex].winner = winner;

  const nextRoundIndex = roundIndex + 1;
  if (nextRoundIndex >= roundTypes.length) return withWinner;

  if (roundTypes[nextRoundIndex] === "survive") {
    const destMatch = Math.floor(matchIndex / 2);
    const slot = matchIndex % 2 === 0 ? "playerHome" : "playerAway";
    return placeAndResolve(withWinner, roundTypes, nextRoundIndex, destMatch, slot, winner);
  }
  // "drop" round: this round's winners fill the survivor (home) slot, 1:1 by index.
  return placeAndResolve(withWinner, roundTypes, nextRoundIndex, matchIndex, "playerHome", winner);
}

export function advanceWBLoserIntoLB(losersRounds, roundTypes, wbRoundIndex, wbMatchIndex, loser) {
  if (wbRoundIndex === 0) {
    const destMatch = Math.floor(wbMatchIndex / 2);
    const slot = wbMatchIndex % 2 === 0 ? "playerHome" : "playerAway";
    return placeAndResolve(losersRounds, roundTypes, 0, destMatch, slot, loser);
  }
  const dropIndex = dropRoundIndexForWbRound(wbRoundIndex);
  return placeAndResolve(losersRounds, roundTypes, dropIndex, wbMatchIndex, "playerAway", loser);
}

export function getDoubleElimChampion({ winnersRounds, losersRounds, grandFinal }) {
  const wbChampion = winnersRounds?.at(-1)?.[0]?.winner ?? null;
  const lbChampion = losersRounds?.at(-1)?.[0]?.winner ?? null;
  if (!wbChampion || !lbChampion || !grandFinal?.game1?.winner) return null;
  if (grandFinal.game1.winner.id === wbChampion.id) return wbChampion;
  if (!grandFinal.game2) return null;
  return grandFinal.game2.winner ?? null;
}
