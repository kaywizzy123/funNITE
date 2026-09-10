import { Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center flex-1 text-center mx-2 md:mx-0">
      <div className="flex flex-col justify-center items-center gap-4">
        <Gamepad2
          size={148}
          className="text-blue-500 transition-all duration-300 hover:animate-spin hover:scale-110 hover:text-blue-200"
        />
        <h1 className="text-5xl md:text-7xl font-bold text-blue-500">
          Welcome to funNITE
        </h1>
        <h2 className="text-3xl md:text-5xl text-blue-300">
          The Ultimate AI Powered Fixtures Generator
        </h2>
        <h3 className="text-2xl md:text-3xl text-neutral-500">
          Ditch the Paper. Track the Bragging Rights
        </h3>
        <p className="text-sm md:text-md text-neutral-500">
          Generate Instant game fixtures, live round-robin pairings, and
          automatedd couch leaderboards for your local gaming nights
        </p>
        <Link className="flex items-center gap-0.5 bg-blue-500 px-5 py-2.5 rounded-4xl transition-all duration-300 hover:scale-105 active:scale-95">
          Get Started
        </Link>
      </div>
    </div>
  );
}
