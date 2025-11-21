// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EnviarPix from "./pages/EnviarPix";
import Historico from "./pages/Historico";
import Transacao from "./pages/Transacao";

import BottomMenu from "./components/BottomMenu";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container" style={{ paddingBottom: "80px" }}>
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
