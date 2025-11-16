// src/pages/Historico.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function Historico() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    try {
      const res = await api.get("/transacoes");
      const data = res.data.transacoes || res.data.historico || [];

      const normalized = data.map(row => {
        if (Array.isArray(row)) {
          return { id: row[0], remetente: row[1], destinatario: row[2], valor: row[3] };
        }
        return row;
      });

      setRows(normalized);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }

  async function limpar() {
  // eslint-disable-next-line no-restricted-globals
  if(confirm("Tem certeza que deseja limpar o histórico?")) {
    try {
      await api.delete("/clear_logs"); // mudou de /transacoes/limpar para /clear_logs
      setRows([]); // limpa o frontend imediatamente
    } catch(err) {
      console.error(err);
      alert("Erro ao limpar.");
    }
  }
}

  useEffect(() => { fetch(); }, []);

  return (
    <div className="container">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Histórico de Transações</h3>

        {/* Botão de limpar histórico */}
        <button
          onClick={limpar}
          className="btn btn-danger"
          style={{ marginBottom: 10 }}
        >
          Limpar Histórico
        </button>

        {loading ? (
          <p className="small">Carregando...</p>
        ) : (
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Remetente</th>
                <th>Destinatário</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan="4" className="small">Sem registros</td>
                </tr>
              )}

              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.remetente}</td>
                  <td>{r.destinatario}</td>
                  <td>R$ {Number(r.valor).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
