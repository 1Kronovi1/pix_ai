// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Home as HomeIcon, Send, History } from "lucide-react";

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

  // 🔥 Componente do MENU FIXO
  return (
    <div className="container" style={{ padding: 12 }}>
      <div className="card" style={{ padding: 16 }}>
        <h2 style={{ margin: 0 }}>Bem-vindo ao PIX — Conta Demo</h2>
        <p className="small" style={{ marginTop: 8, color: "#6b7280" }}>
          Interface clara e moderna para demonstrar validação de transações via IA. 
          Use <strong>Enviar PIX</strong> para simular uma transferência.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }} className="card">
            <div style={{ fontSize: 12, color: "#6b7280" }}>Saldo disponível</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
              R$ {Number(saldo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="small" style={{ marginTop: 8, color: "#6b7280" }}>
              Conta: Conta de Teste • BR
            </div>
          </div>

          <div style={{ width: 260, minWidth: 220 }} className="card">
            <div style={{ fontSize: 12, color: "#6b7280" }}>Última transação</div>

            {loading ? (
              <div style={{ marginTop: 8 }} className="small">Carregando...</div>
            ) : ultima ? (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontWeight: 700 }}>
                  R$ {Number(ultima.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} → {ultima.destinatario}
                </div>
                <div className="small" style={{ marginTop: 8, color: "#10b981" }}>Tudo ok</div>
              </div>
            ) : (
              <div style={{ marginTop: 6 }} className="small">Sem transações</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
