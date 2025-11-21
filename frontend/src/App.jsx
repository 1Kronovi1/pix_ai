// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import EnviarPix from "./pages/EnviarPix";
import Historico from "./pages/Historico";
import Transacao from "./pages/Transacao";
import WelcomeModal from "./components/WelcomeModal";

import BottomMenu from "./components/BottomMenu";
import "./index.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="app-container relative" style={{ paddingBottom: "80px" }}>
        {/* Toggle Dark Mode */}
        <div className="absolute top-4 right-4 z-50">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="sr-only"
            />
            <div className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 relative transition-all">
              <div
                className="w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow absolute top-0.5 left-0.5 transition-all"
                style={{ transform: darkMode ? "translateX(24px)" : "translateX(0)" }}
              ></div>
            </div>
          </label>
        </div>

        <WelcomeModal />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enviar" element={<EnviarPix />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/transacao" element={<Transacao />} />
        </Routes>

        <BottomMenu />
      </div>
    </BrowserRouter>
  );
}
