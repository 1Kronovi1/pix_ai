// src/pages/EnviarPix.jsx
import React, { useState } from "react";
import { analisarTransacao } from "../api";

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
            <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
              Destinatários disponíveis:
            </label>

            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--input-bg)",
                color: "var(--text-color)",
                cursor: "pointer"
              }}
              defaultValue=""
            >
              <option value="" disabled>Selecione para visualizar</option>
              <option value="LojaX">🟢 LojaX — (Seguro)</option>
              <option value="MercadoA">🟢 MercadoA — (Seguro)</option>
              <option value="AmigoY">🟢 AmigoY — (Seguro)</option>
              <option value="ContaFake">🔴 ContaFake — (Suspeito)</option>
              <option value="GolpistaZ">🔴 GolpistaZ — (Suspeito)</option>
            </select>

            <p style={{ marginTop: "10px", fontSize: "13px", opacity: 0.8 }}>
              *Esta lista serve apenas para consulta.  
              Digite o nome do destinatário no campo acima.
            </p>
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fee2e2", color: "#b91c1c" }}>
              {error}
            </div>
          )}

          {resultado && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#fff", border: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, color: resultado.status === "suspeito" ? "#b91c1c" : "#059669", fontWeight: 800 }}>
                    {resultado.status === "suspeito" ? "🚨 Transação Suspeita" : "✅ Transação Segura"}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{resultado.mensagem}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Score</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{resultado.score_risco}</div>
                  {resultado.boost_aplicado !== undefined && (
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Boost: {resultado.boost_aplicado}</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12, height: 10, borderRadius: 8, background: "#e6eef3", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, Math.max(0, (Number(resultado.score_risco) + 1.5) / 2.5 * 100))}%`,
                    background: resultado.status === "suspeito" ? "#ef4444" : "#10b981",
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
