// src/pages/Historico.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function Historico(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetch(){
    try {
      const res = await api.get("/transacoes");
      // Suporta duas formas de retorno: { transacoes: [...] } ou { historico: [...] }
      const data = res.data.transacoes || res.data.historico || [];
      // normalizar para objetos: backend pode retornar arrays
      const normalized = data.map(row => {
        if(Array.isArray(row)){
          // caso seja [id, remetente, destinatario, valor, ...]
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

  useEffect(()=>{ fetch(); }, []);

  return (
    <div className="container">
      <div className="card">
        <h3 style={{marginTop:0}}>Histórico de Transações</h3>
        {loading ? <p className="small">Carregando...</p> : (
          <table className="table" style={{marginTop:12}}>
            <thead>
              <tr>
                <th>ID</th><th>Remetente</th><th>Destinatário</th><th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="4" className="small">Sem registros</td></tr>}
              {rows.map(r=>(
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
