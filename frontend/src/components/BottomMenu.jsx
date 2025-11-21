// src/components/BottomMenu.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, Send, History } from "lucide-react";

export default function BottomMenu() {
  const { pathname } = useLocation();

  const iconStyle = {
    background: "#f5f5f5",
    padding: "12px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "12px 25px",
        borderRadius: "40px",
        display: "flex",
        gap: "30px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        zIndex: 1000,
      }}
    >
      <Link to="/" style={iconStyle}>
        <Home size={22} stroke={pathname === "/" ? "#7c3aed" : "#000"} />
      </Link>

      <Link to="/enviar" style={iconStyle}>
        <Send size={22} stroke={pathname === "/enviar" ? "#7c3aed" : "#000"} />
      </Link>

      <Link to="/historico" style={iconStyle}>
        <History
          size={22}
          stroke={pathname === "/historico" ? "#7c3aed" : "#000"}
        />
      </Link>
    </div>
  );
}
