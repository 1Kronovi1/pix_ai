// src/pages/EnviarPix.jsx
import React, { useState } from "react";
import { analisarTransacao } from "../api";
import { motion } from "framer-motion";

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
        valor: String(valor),
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ minHeight: "80vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <div style={{ padding: 25, backgroundColor: "white" }}>
          <h2 style={{ margin: 0, marginBottom: 8, fontSize: "1.7rem", fontWeight: "800", color: "var(--purple)" }}>Transferir</h2>
          <p className="small" style={{ marginTop: 6, marginBottom: 12, color: "#6b7280" }}>
            Preencha primeiro com seu nome, nome do destinatário (um presente na lista) e o valor.
          </p>

          {/* ===== FORMULÁRIO ===== */}
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label className="label" style={{ fontWeight: 600 }}>Nome</label>
            <input
              className="input"
              value={remetente}
              onChange={(e) => setRemetente(e.target.value)}
              placeholder="eu nome (ex: Bruno)"
              required
            />

            <label className="label" style={{ fontWeight: 600 }}>Destino (chave)</label>
            <input
              className="input"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              placeholder="Chave PIX ou nome (ex: LojaX)"
              required
            />

            <label className="label" style={{ fontWeight: 600 }}>Valor (R$)</label>
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
                style={{ flex: 1, background: "var(--purple)", color: "#fff", fontWeight: 700 }}
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

          {resultado && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#fff", border: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      color: resultado.status === "suspeito" ? "#b91c1c" : "#059669",
                      fontWeight: 800,
                    }}
                  >
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
                    width: `${Math.min(100, Math.max(0, ((Number(resultado.score_risco) + 1.5) / 2.5) * 100))}%`,
                    background: resultado.status === "suspeito" ? "#ef4444" : "#10b981",
                    transition: "width 700ms ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* ===== DROPDOWN FORA DO FORM (IMPORTANTE!) ===== */}
          <div
            style={{
              marginTop: "20px",
              background: "var(--card-bg)",
              padding: "15px",
            }}
          >
            <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block", color: "var(--purple)" }}>
              Destinatários disponíveis:
            </label>

            <p value="" style={{color: "green", fontSize: "14px"}}>🟢 LojaX — (Seguro)</p>
            <p value="" style={{color: "green", fontSize: "14px"}}>🟢 MercadoA — (Seguro)</p>
            <p value="" style={{color: "green", fontSize: "14px"}}>🟢 AmigoY — (Seguro)</p>
            <p value="" style={{color: "red", fontSize: "14px"}}>🔴 ContaFake — (Suspeito)</p>
            <p value="" style={{color: "red", fontSize: "14px"}}>🔴 GolpistaZ — (Suspeito)</p>

            <p style={{ marginTop: "10px", fontSize: "13px", opacity: 0.6 }}>
              *Esta lista é apenas para visualização.  
              Digite o nome do destinatário no campo acima.
            </p>
          </div>

          {/* ===== RESULTADO ===== */}
          {error && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fee2e2", color: "#b91c1c" }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
