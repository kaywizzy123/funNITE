import { useEffect, useState } from "react"; // 1. Import useState
import { ChevronDown, Plus } from "lucide-react";
import PlayerDetails from "../components/PlayerDetails";
import { Link } from "react-router-dom";

export default function Create() {
  const [err, setErr] = useState("");
  const [players, setPlayers] = useState([
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
  ]);

  useEffect(() => {
    if (!err) return;
    const timeout = setTimeout(() => setErr(""), 3000);
    return () => clearTimeout(timeout);
  }, [err]);

  function handleAdd() {
    setErr("");
    setPlayers((prevPlayers) => {
      return [
        ...prevPlayers,
        {
          id: crypto.randomUUID(),
          name: "",
        },
      ];
    });
  }

  return (
    <div className="flex justify-center flex-1 text-center mx-2 md:mx-0">
      <div className="flex flex-col m-4 w-full gap-4 items-center">
        <h1 className="text-3xl md:text-5xl font-bold">Create New Game</h1>
        <div className="flex flex-col w-full justify-center items-center">
          <fieldset className="border border-neutral-50/6 bg-neutral-700/10 rounded-2xl w-full md:w-xl">
            <legend>Enter Players details</legend>

            <div className="flex flex-col gap-2 justify-center items-center m-5">
              <div className="w-full flex justify-between items-center gap-2 mb-3">
                <div className="relative w-full max-w-xs">
                  <select className="w-full appearance-none rounded-full bg-blue-500 px-4 py-2.5 pr-10 text-sm text-neutral-50 shadow-sm transition-all focus:border-none focus:outline-none focus:ring-0 focus:ring-indigo-100">
                    <option value="knockout">Knockout</option>
                    <option value="league">League</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-50">
                    <ChevronDown size={18} />
                  </div>
                </div>

                <div className="relative w-full max-w-xs">
                  <select className="w-full appearance-none rounded-full bg-blue-500 px-4 py-2.5 pr-10 text-sm text-neutral-50 shadow-sm transition-all focus:border-none focus:outline-none focus:ring-0 focus:ring-indigo-100">
                    <option value="single">Single</option>
                    <option value="home_away">Home & Away</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-50">
                    <ChevronDown size={18} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="bg-blue-500 rounded-full p-1 transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Plus />
                </button>
              </div>
              <p className="text-red-400">{err}</p>
              <p className="text-neutral-500">
                Number of Players: {players.length}
              </p>
              <div className="w-full flex flex-col gap-2 max-h-144 overflow-auto">
                {players.map((player, index) => (
                  <PlayerDetails
                    key={player.id}
                    id={player.id}
                    name={player.name}
                    count={index + 1}
                    setPlayers={setPlayers}
                    players={players}
                    setErr={setErr}
                  />
                ))}
              </div>
            </div>
          </fieldset>
        </div>
        <Link
          to="/fixtures"
          className="flex items-center justify-center gap-0.5 bg-blue-500 px-10 py-1.5 rounded-4xl transition-all duration-300 hover:scale-105 active:scale-95 text-2xl"
        >
          Generate Fixtures
        </Link>
      </div>
    </div>
  );
}
