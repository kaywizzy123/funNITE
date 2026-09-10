import { Gamepad2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full h-14 flex justify-between px-2 sm:px-20 border-b border-b-neutral-600/20">
      <Link to="/" className="flex items-center gap-1">
        <Gamepad2 className="text-blue-500" />
        <h1 className="font-bold text-3xl text-blue-200">
          fun<span className="text-blue-500">NITE</span>
        </h1>
      </Link>

      <div className="flex items-center">
        <Link
          to="/create"
          className="flex items-center gap-0.5 bg-blue-500 px-2 py-1.5 rounded-4xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Plus size={16} />
          Create new
        </Link>
      </div>
    </nav>
  );
}
