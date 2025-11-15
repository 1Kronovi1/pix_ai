import { useState } from "react";
import api from "../api";
import "./Transacao.css"; // vamos criar esse arquivo tbm

export default function Transacao() {
  const [remetente, setRemetente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [valor, setValor] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  async function enviarFormulario(e) {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("remetente", remetente);
      formData.append("destinatario", destinatario);
      formData.append("valor", valor);

      const resp = await api.post("/assess", formData);

      setResultado(resp.data);
    } catch (err) {
      console.error("Erro ao consultar backend:", err);
      setResultado({
        erro: true,
        mensagem: "Erro ao conectar ao servidor.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="trans-container">

      <h1 className="titulo">Análise Inteligente de PIX</h1>

      {/* -------- FORMULÁRIO -------- */}
      <form onSubmit={enviarFormulario} className="trans-form">

        <input
          type="text"
          placeholder="Nome do remetente"
          value={remetente}
          onChange={(e) => setRemetente(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Nome do destinatário"
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Valor do PIX"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Analisando..." : "Enviar para Análise"}
        </button>

      </form>

      {/* -------- RESULTADO -------- */}
      {resultado && (
        <div
          className={
            resultado.erro
              ? "alerta erro"
              : resultado.status === "suspeito"
              ? "alerta suspeito"
              : "alerta seguro"
          }
        >
          <h3>{resultado.mensagem}</h3>

          {!resultado.erro && (
            <>
              <p><strong>Score:</strong> {resultado.score_risco}</p>
              <p><strong>Status:</strong> {resultado.status}</p>
              <p><strong>Remetente:</strong> {resultado.remetente}</p>
              <p><strong>Destinatário:</strong> {resultado.destinatario}</p>
              <p><strong>Valor:</strong> R$ {resultado.valor}</p>
            </>
          )}
        </div>
      )}

    </div>
  );
}
