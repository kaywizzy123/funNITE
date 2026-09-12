export function computeStandings(rounds) {
  const table = new Map();

  function entry(player) {
    if (!player || player.name === "Bye") return null;
    if (!table.has(player.id)) {
      table.set(player.id, {
        player,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        points: 0,
      });
    }
    return table.get(player.id);
  }

  rounds.forEach((round) =>
    round.forEach((match) => {
      const home = entry(match.playerHome);
      const away = entry(match.playerAway);
      if (!home || !away) return;
      if (match.scoreHome === null || match.scoreAway === null) return;

      home.played++;
      away.played++;
      home.gf += match.scoreHome;
      home.ga += match.scoreAway;
      away.gf += match.scoreAway;
      away.ga += match.scoreHome;

      if (match.scoreHome === match.scoreAway) {
        home.drawn++;
        away.drawn++;
        home.points += 1;
        away.points += 1;
      } else if (match.scoreHome > match.scoreAway) {
        home.won++;
        away.lost++;
        home.points += 3;
      } else {
        away.won++;
        home.lost++;
        away.points += 3;
      }
    }),
  );

  return Array.from(table.values())
    .map((row) => ({ ...row, gd: row.gf - row.ga }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.gd - a.gd ||
        b.gf - a.gf ||
        a.player.name.localeCompare(b.player.name),
    );
}

export function isLeagueComplete(rounds) {
  return (
    rounds.length > 0 &&
    rounds.every((round) =>
      round.every((match) => match.scoreHome !== null && match.scoreAway !== null),
    )
  );
}
