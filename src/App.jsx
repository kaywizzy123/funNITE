import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Create";
import { AppProvider } from "./context/AppContext";
import Fixtures from "./pages/Fixtures";
import ResetConfirmModal from "./components/ResetConfirmModal";

export default function App() {
  return (
    <AppProvider>
      <div className="bg-neutral-950 w-full min-h-screen text-white flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/fixtures" element={<Fixtures />} />
        </Routes>
        <ResetConfirmModal />
      </div>
    </AppProvider>
  );
}
