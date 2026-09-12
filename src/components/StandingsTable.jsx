export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) return null;

  return (
    <div className="w-full overflow-auto rounded-2xl border border-neutral-500/40 bg-neutral-950">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-neutral-500 border-b border-neutral-500/40">
            <th className="text-left font-medium py-2 px-3">Player</th>
            <th className="font-medium py-2 px-2">P</th>
            <th className="font-medium py-2 px-2">W</th>
            <th className="font-medium py-2 px-2">D</th>
            <th className="font-medium py-2 px-2">L</th>
            <th className="font-medium py-2 px-2">GF</th>
            <th className="font-medium py-2 px-2">GA</th>
            <th className="font-medium py-2 px-2">GD</th>
            <th className="font-medium py-2 px-3 text-blue-500">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.player.id}
              className="border-b border-neutral-500/10 last:border-0"
            >
              <td className="text-left py-2 px-3 truncate">{row.player.name}</td>
              <td className="py-2 px-2">{row.played}</td>
              <td className="py-2 px-2">{row.won}</td>
              <td className="py-2 px-2">{row.drawn}</td>
              <td className="py-2 px-2">{row.lost}</td>
              <td className="py-2 px-2">{row.gf}</td>
              <td className="py-2 px-2">{row.ga}</td>
              <td className="py-2 px-2">{row.gd}</td>
              <td className="py-2 px-3 font-semibold text-blue-500">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
