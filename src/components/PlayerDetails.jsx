import { Minus, User } from "lucide-react";

export default function PlayerDetails({ id, name }) {
  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <p className="flex justify-center items-center text-lg">{id}</p>
      <input
        type="text"
        className="flex-1 bg-neutral-50/10 rounded-4xl px-3.5 py-2 outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={`Enter ${name} name...`}
      />
      <div className="flex justify-center items-center w-10 h-10 bg-neutral-300/30 border border-neutral-400/70 rounded-full ">
        <User className="text-neutral-400" />
      </div>
      <div className="flex justify-center items-center w-6 h-6 transition-all duration-300 rounded-full bg-red-500 hover:scale-115 active:scale-95 hover:bg-red-700 active:bg-red-300">
        <Minus size={20} />
      </div>
    </div>
  );
}
