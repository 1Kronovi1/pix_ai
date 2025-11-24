// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Home as HomeIcon, Send, History, CircleUser } from "lucide-react";
import { CircleUserRound } from 'lucide-react';

export default function Home() {
  const [saldo] = useState(3250.0);
  const [ultima, setUltima] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca última transação
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.get("/transacoes");
        const rows = res.data.transacoes || res.data.historico || [];
        if (!mounted) return;

        if (Array.isArray(rows) && rows.length > 0) {
          const first = rows[0];
          const normalized = Array.isArray(first)
            ? { id: first[0], remetente: first[1], destinatario: first[2], valor: first[3] }
            : first;
          setUltima(normalized);
        }
      } catch (err) {
        console.error("Erro ao buscar transacoes na Home:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className="container" style={{ padding: 0, margin: 0}}>
      <div className="card" style={{ padding: 0 }}>
        <div className="container-top">
          <div className="container-user">
            <CircleUserRound className="icon"/>
            <h2 className="user-title" style={{ margin: 0, color: "white" }}>Admin demo</h2>
          </div>
          <p className="small" style={{ marginTop: 8, color: "#ffffff92" }}>
            Interface demonstrativa para visualizar a validação de transações via IA.
            Aperte <strong><Send size={12} /></strong> para simular uma transferência.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap",padding: 16 }}>
          <div style={{ flex: 1, minWidth: 220 }} className="card">
            <div style={{ fontSize: 12, color: "#6b7280" }}>Saldo disponível</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color:"rgba(123, 39, 192, 0.77)"}}>
              R$ {Number(saldo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="small" style={{ marginTop: 8, color: "#6b7280" }}>
              ( Conta meramente demonstrativa )
            </div>
          </div>

          <div style={{ width: 260, minWidth: 220 }} className="card">
            <div style={{ fontSize: 12, color: "#6b7280" }}>Última transação</div>

            {loading ? (
              <div style={{ marginTop: 8 }} className="small">Carregando...</div>
            ) : ultima ? (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontWeight: 700, color:"rgba(123, 39, 192, 0.77)" }}>
                  R$ {Number(ultima.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} → {ultima.destinatario}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 6 }} className="small">Sem transações</div>
            )}
          </div>
        </div>
      </div>

      {/* ============================
          Créditos no rodapé da Home
          ============================ */}
      <div style={{ textAlign: "center", marginTop: 20, padding: 10, opacity: 0.75 }}>
        <p style={{ margin: 0, fontSize: 13 }}>
          Sistema desenvolvido por <strong>Bruno Oliveira</strong>
        </p>

        <a
          href="https://github.com/1Kronovi1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            color: "#6b21a8",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "5px"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ opacity: 0.9 }}
          >
            <path d="M12 0C5.37 0 0 5.42 0 12.12c0 5.36 3.44 9.9 8.2 11.5.6.12.82-.27.82-.6v-2.1c-3.34.74-4.04-1.65-4.04-1.65-.54-1.4-1.32-1.77-1.32-1.77-1.1-.78.08-.76.08-.76 1.22.09 1.86 1.28 1.86 1.28 1.08 1.88 2.84 1.34 3.53 1.03.1-.8.42-1.34.76-1.65-2.67-.31-5.47-1.37-5.47-6.1 0-1.35.46-2.45 1.22-3.32-.12-.3-.53-1.54.12-3.2 0 0 1-.33 3.3 1.27a11.1 11.1 0 0 1 6 0c2.3-1.6 3.3-1.27 3.3-1.27.65 1.66.24 2.9.12 3.2.76.87 1.22 1.97 1.22 3.32 0 4.75-2.8 5.78-5.48 6.1.44.4.82 1.17.82 2.36v3.5c0 .32.22.72.82.6A12.1 12.1 0 0 0 24 12.12C24 5.42 18.63 0 12 0z"/>
          </svg>

          GitHub: 1Kronovi1
        </a>
      </div>
    </div>
  );
}
