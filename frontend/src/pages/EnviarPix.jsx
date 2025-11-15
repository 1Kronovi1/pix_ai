// src/pages/Transacao.jsx
import React, { useState } from "react";
import { analisarTransacao } from "../api"; // usa a função que criamos em api.js

export default function Transacao() {
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
        valor: parseFloat(valor),
      });
      setResultado(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao comunicar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", padding: 20, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 520 }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 6px 20px rgba(2,6,23,0.06)" }}>
          <h2 style={{ margin: 0, marginBottom: 10 }}>💸 Fazer PIX</h2>
          <p style={{ color: "#6b7280", marginTop: 6, marginBottom: 14 }}>Preencha os dados e confirme para análise automática.</p>

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label style={{ fontWeight: 600 }}>Remetente</label>
            <input
              className="input"
              value={remetente}
              onChange={(e) => setRemetente(e.target.value)}
              placeholder="Seu nome"
              required
            />

            <label style={{ fontWeight: 600 }}>Destinatário (chave)</label>
            <input
              className="input"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              placeholder="Chave PIX ou nome"
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
                style={{ flex: 1, background: "#0f766e", color: "white", fontWeight: 700 }}
                disabled={loading}
              >
                {loading ? "Analisando..." : "Continuar"}
              </button>

              <button
                type="button"
                className="btn ghost"
                onClick={() => { setRemetente(""); setDestinatario(""); setValor(""); setResultado(null); setError(null); }}
                style={{ flex: 1, border: "1px solid #e6e9ee", background: "transparent" }}
              >
                Limpar
              </button>
            </div>
          </form>

          {error && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fee2e2", color: "#b91c1c" }}>
              {error}
            </div>
          )}

          {resultado && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#f8fafc", border: "1px solid #e6eef3" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, color: "#374151", fontWeight: 700 }}>
                    {resultado.status === "suspeito" ? "🚨 Suspeito" : "✅ Seguro"}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{resultado.mensagem}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Score</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{resultado.score_risco}</div>
                </div>
              </div>

              {/* barra de risco */}
              <div style={{ marginTop: 12, height: 10, borderRadius: 8, background: "#e6eef3", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (resultado.score_risco || 0) * 100)}%`,
                    background: resultado.score_risco >= 0.7 ? "#ef4444" : resultado.score_risco >= 0.4 ? "#f59e0b" : "#10b981",
                    transition: "width 700ms ease"
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
