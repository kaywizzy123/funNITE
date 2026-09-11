import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Create";
import { useState } from "react";
import { AppContext } from "./context/AppContext";
import Fixtures from "./pages/Fixtures";

export default function App() {
  const [gameName, setGameName] = useState("");
  const [err, setErr] = useState("");
  const [players, setPlayers] = useState([
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
  ]);

  return (
    <AppContext.Provider
      value={{ gameName, setGameName, err, setErr, players, setPlayers }}
    >
      <div className="bg-neutral-950 w-full min-h-screen text-white flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/fixtures" element={<Fixtures />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}
