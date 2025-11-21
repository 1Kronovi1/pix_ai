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
  const [showModal, setShowModal] = useState(false);

  // Exibe o modal apenas na primeira visita
  useEffect(() => {
    const hasSeen = localStorage.getItem("welcome_seen");
    if (!hasSeen) {
      setShowModal(true);
    }
  }, []);

  const closeModal = () => {
    localStorage.setItem("welcome_seen", "yes");
    setShowModal(false);
  };

  return (
    <BrowserRouter>
      <div className="app-container" style={{ paddingBottom: "80px" }}>
        
        {/* Modal diretamente aqui */}
        {showModal && <WelcomeModal onClose={closeModal} />}

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
