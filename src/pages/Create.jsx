import { ChevronDown, Plus } from "lucide-react";
import PlayerDetails from "../components/PlayerDetails";
import { Link } from "react-router-dom";

export default function Create() {
  const players = [
    { id: 1, name: "Player 1" },
    { id: 2, name: "Player 2" },
    { id: 3, name: "Player 3" },
  ];
  return (
    <div className="flex justify-center  flex-1 text-center mx-2 md:mx-0">
      <div className="flex flex-col m-4 w-full gap-4 items-center">
        <h1 className="text-3xl md:text-5xl font-bold">Create New Game</h1>
        <div className="flex flex-col w-full justify-center items-center">
          <fieldset className="border border-neutral-50/6 bg-neutral-700/10 rounded-2xl w-full md:w-xl">
            <legend>Enter Players details</legend>

            <form className="flex flex-col gap-2 justify-center items-center m-5">
              <div className="w-full flex justify-between items-center gap-2 mb-3">
                <div class="relative w-full max-w-xs">
                  <select class="w-full appearance-none rounded-full bg-blue-500 px-4 py-2.5 pr-10 text-sm text-neutral-50 shadow-sm transition-all focus:border-none focus:outline-none focus:ring-0 focus:ring-indigo-100">
                    <option value="">Knockout</option>
                    <option value="">League</option>
                  </select>

                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-50">
                    <ChevronDown />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </div>
                </div>

                <div class="relative w-full max-w-xs">
                  <select class="w-full appearance-none rounded-full bg-blue-500 px-4 py-2.5 pr-10 text-sm text-neutral-50 shadow-sm transition-all focus:border-none focus:outline-none focus:ring-0 focus:ring-indigo-100">
                    <option value="">Single</option>
                    <option value="">Home & Away</option>
                  </select>

                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-50">
                    <ChevronDown />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </div>
                </div>

                <div className="bg-blue-500 rounded-full p-1 transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95">
                  <Plus />
                </div>
              </div>
              {players.map((player) => (
                <PlayerDetails id={player.id} name={player.name} />
              ))}
            </form>
          </fieldset>
        </div>
        <Link
          to="/create"
          className="flex items-center justify-center gap-0.5 bg-blue-500 px-10 py-1.5 rounded-4xl transition-all duration-300 hover:scale-105 active:scale-95 text-2xl"
        >
          Generate Fixtures
        </Link>
      </div>
    </div>
  );
}
