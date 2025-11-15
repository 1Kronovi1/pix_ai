// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import EnviarPix from "./pages/EnviarPix";   // sua tela antiga (pode manter)
import Historico from "./pages/Historico";
import Transacao from "./pages/Transacao";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enviar" element={<EnviarPix />} />
        <Route path="/historico" element={<Historico />} />

        {/* Nova rota da tela PIX com IA */}
        <Route path="/transacao" element={<Transacao />} />
      </Routes>
    </BrowserRouter>
  );
}
