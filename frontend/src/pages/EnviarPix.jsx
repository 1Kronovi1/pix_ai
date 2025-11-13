// src/pages/EnviarPix.jsx
import { useState } from "react";
import api from "../api";

export default function EnviarPix(){
  const [destino, setDestino] = useState("");
  const [valor, setValor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  // Ao confirmar a senha, envia ao backend para análise
  const confirmar = async () => {
    setLoading(true);
    setResultado(null);
    try {
      // envia como FormData (compatível com FastAPI que espera form fields)
      const form = new FormData();
      form.append("remetente", "Usuário Simulado"); // campo fixo; no seu caso pode ser dinâmico
      form.append("destinatario", destino);
      form.append("valor", parseFloat(valor));
      // se seu backend usa /pix em vez de /assess, altere aqui para "/pix"
      const res = await api.post("/assess", form);
      // o backend deve retornar um status simples: "seguro" ou "suspeito"
      const status = res.data.status || (res.data.score_risco && res.data.score_risco > 0.7 ? "suspeito" : "seguro");
      // IA invisível: mostramos apenas uma mensagem final
      if(status === "suspeito"){
        setResultado({ ok: false, message: "Transação bloqueada por medidas de segurança." });
      } else {
        setResultado({ ok: true, message: "PIX autorizado com sucesso." });
      }
    } catch (err) {
      console.error(err);
      setResultado({ ok: false, message: "Erro ao comunicar com o servidor. Tente novamente." });
    } finally {
      setLoading(false);
      setShowModal(false);
      setSenha("");
    }
  };

  const submeter = (e) => {
    e.preventDefault();
    // validações rápidas
    if(!destino || !valor) return alert("Preencha destinatário e valor.");
    setShowModal(true);
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:520, margin:"0 auto"}}>
        <h3 style={{marginTop:0}}>Enviar PIX</h3>
        <p className="small">Fluxo: digite destino → valor → confirme com sua senha.</p>

        <form className="form" onSubmit={submeter} style={{marginTop:12}}>
          <input className="input" placeholder="Chave PIX / Destinatário" value={destino} onChange={e=>setDestino(e.target.value)} />
          <input className="input" placeholder="Valor (ex: 120.50)" type="number" step="0.01" value={valor} onChange={e=>setValor(e.target.value)} />
          <div style={{display:"flex", gap:8}}>
            <button className="btn" type="submit">Continuar</button>
            <button type="button" className="btn ghost" onClick={()=>{ setDestino(""); setValor(""); }}>Limpar</button>
          </div>
        </form>

        {resultado && (
          <div style={{marginTop:14}}>
            <div className={resultado.ok ? "result-ok" : "result-bad"}>{resultado.message}</div>
          </div>
        )}
      </div>

      {/* Modal de senha */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirme com sua senha</h3>
            <p className="small">Para autorizar esta transação, insira sua senha de confirmação.</p>
            <input className="input" type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} />
            <div className="foot">
              <button className="btn ghost" onClick={()=>{ setShowModal(false); setSenha(""); }}>Cancelar</button>
              <button className="btn" onClick={confirmar} disabled={loading || senha.length < 4}>
                {loading ? "Aguarde..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
