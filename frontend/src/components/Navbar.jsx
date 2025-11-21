// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  // Carrega preferência salva
  useEffect(() => {
    const saved = localStorage.getItem("theme_mode");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Aplica tema quando trocar
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme_mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme_mode", "light");
    }
  }, [dark]);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 2000,
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "8px 12px",
        boxShadow: "var(--shadow)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer"
      }}
      onClick={() => setDark((v) => !v)}
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
      <span style={{ fontSize: 14, fontWeight: 600 }}>
        {dark ? "Light Mode" : "Dark Mode"}
      </span>
    </div>
  );
}
