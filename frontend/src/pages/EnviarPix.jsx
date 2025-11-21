// src/pages/EnviarPix.jsx
import React, { useState } from "react";
import { analisarTransacao } from "../api";

function DropdownDestinatariosVisual() {
  const [open, setOpen] = useState(false);

  const destinatarios = [
    { nome: "LojaX", tipo: "safe" },
    { nome: "MercadoA", tipo: "safe" },
    { nome: "AmigoY", tipo: "safe" },
    { nome: "ContaFake", tipo: "danger" },
    { nome: "GolpistaZ", tipo: "danger" }
  ];

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          background: "var(--input-bg)",
          color: "var(--text-color)",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Destinatários disponíveis {open ? "▲" : "▼"}
      </button>

      {open && (
        <div
          style={{
            marginTop: "10px",
            borderRadius: "8px",
            padding: "10px",
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)"
          }}
        >
          {destinatarios.map((d, i) => (
            <div
              key={i}
              style={{
                padding: "8px",
                borderRadius: "6px",
                marginBottom: "6px",
                fontWeight: "bold",
                userSelect: "none",
                cursor: "default",
                background:
                  d.tipo === "safe" ? "#e7ffe7" : "#ffe6e6",
                color:
                  d.tipo === "safe" ? "#1d7d32" : "#b30000"
              }}
            >
              {d.tipo === "safe" ? "🟢" : "🔴"} {d.nome}
            </div>
          ))}

          <p
            style={{
              marginTop: "8px",
              fontSize: "12px",
              opacity: 0.7
            }}
          >
            *Apenas para consulta. Digite o nome no campo acima.
          </p>
        </div>
      )}
    </div>
  );
}


export default function EnviarPix() {
  const [remetente, setRemetente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError(null);

    try {
      const data = await analisarTransacao({
        remetente,
        destinatario,
        valor: String(valor)
      });
      setResultado(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao comunicar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setRemetente("");
    setDestinatario("");
    setValor("");
    setResultado(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: "80vh", padding: 12, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <div className="card" style={{ padding: 16 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>💸 Enviar PIX</h2>
          <p className="small" style={{ marginTop: 6, marginBottom: 12, color: "#6b7280" }}>
            Preencha os dados e confirme para análise automática. A IA analisará risco e retornará resultado.
          </p>

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label style={{ fontWeight: 600 }}>Remetente</label>
            <input
              className="input"
              value={remetente}
              onChange={(e) => setRemetente(e.target.value)}
              placeholder="Seu nome (ex: Bruno)"
              required
            />

            <label style={{ fontWeight: 600 }}>Destinatário (chave)</label>
            <input
              className="input"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              placeholder="Chave PIX ou nome (ex: LojaX)"
              required
            />

            <label style={{ fontWeight: 600 }}>Valor (R$)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 120.50"
              required
            />

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn"
                type="submit"
                style={{ flex: 1, background: "#6b21a8", color: "#fff", fontWeight: 700 }}
                disabled={loading}
              >
                {loading ? "Analisando..." : "Continuar"}
              </button>

              <button
                type="button"
                className="btn ghost"
                onClick={limpar}
                style={{ flex: 1, border: "1px solid #e6e9ee", background: "transparent" }}
              >
                Limpar
              </button>
            </div>
          </form>

          {/* ============================
              🔽 DROPDOWN DE DESTINATÁRIOS
              ============================ */}
          <div
            style={{
              marginTop: "20px",
              background: "var(--card-bg)",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <DropdownDestinatariosVisual />
          </div>
        </div>
      </div>
    </div>
  );
}
