// src/pages/Historico.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import ConfirmModal from "../components/ConfirmModal";
import { motion } from "framer-motion";

export default function Historico() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function fetchTransacoes() {
    setLoading(true);
    try {
      const res = await api.get("/transacoes");
      const data = res.data.transacoes || res.data.historico || [];
      const normalized = data.map((row) => {
        if (Array.isArray(row)) {
          // [id, remetente, destinatario, valor, ...]
          return {
            id: row[0],
            remetente: row[1],
            destinatario: row[2],
            valor: row[3],
            status: row[5] || "seguro",
            suspeito_dest: row[6] || 0,
            timestamp: row[0] ? "" : ""
          };
        }
        // possível objeto já normalizado
        return {
          id: row.id || row[0],
          remetente: row.remetente,
          destinatario: row.destinatario,
          valor: row.valor,
          status: row.status || "seguro",
          suspeito_dest: row.suspeito_dest || 0,
          timestamp: row.timestamp || ""
        };
      });

      setRows(normalized);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }

  function limpar() {
    setShowConfirm(true);
  }

  async function confirmarLimpeza() {
    // eslint-disable-next-line no-restricted-globals
    setClearing(true);
    try {
      await api.delete("/transacoes/limpar");
      setRows([]);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao limpar histórico.");
    } finally {
      setClearing(false);
    }
  }

  useEffect(() => {
    fetchTransacoes();
    // opcional: atualizar a cada X segundos
    // const id = setInterval(fetchTransacoes, 15000);
    // return () => clearInterval(id);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0 }} className="container" style={{ padding: 0, margin: 0 }}>
      <div style={{ padding: 25, backgroundColor: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="history-top-container">
            <h3 style={{ margin: 0, marginBottom: "15px", color: "var(--purple)", fontWeight: "800", fontSize: "1.7rem" }}>Histórico de Transações</h3>
            <div>
              <button
                onClick={fetchTransacoes}
                className="btn ghost"
                style={{ marginRight: 8 }}
                disabled={loading}
              >
                Atualizar
              </button>
              <button
                onClick={limpar}
                className="btn btn-danger"
                disabled={clearing}
                style={{ backgroundColor: "var(--purple)" }}
              >
                {clearing ? "Limpando..." : "Limpar Histórico"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {loading ? (
            <div className="small">Carregando...</div>
          ) : rows.length === 0 ? (
            <div className="small">Sem registros</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {rows.map((r) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.3 }}
                  key={r.id}
                  className="card"
                  style={{
                    padding: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: r.suspeito_dest === 1 || r.status === "suspeito" ? "#fee2e2" : "#ecfdf5",
                        color: r.suspeito_dest === 1 || r.status === "suspeito" ? "#b91c1c" : "#059669",
                        fontWeight: 700
                      }}
                    >
                      {r.remetente ? r.remetente.charAt(0).toUpperCase() : "R"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "gray" }}>{r.destinatario}</div>
                      <div className="small" style={{ color: "#6b7280" }}>{r.timestamp || ""}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "var(--purple)" }}>
                      R$ {Number(r.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="small" style={{ color: r.status === "suspeito" ? "#b91c1c" : "#059669" }}>
                      {r.status === "suspeito" ? "Suspeito" : "Seguro"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <ConfirmModal
          isOpen={showConfirm}
          message="Tem certeza que deseja limpar o histórico?"
          onConfirm={confirmarLimpeza}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </motion.div>
  );
}
