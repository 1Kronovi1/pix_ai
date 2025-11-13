// src/pages/Home.jsx
export default function Home(){
  return (
    <div className="container">
      <div className="card">
        <h2 style={{margin:0}}>Bem-vindo ao Simulador PIX</h2>
        <p className="small" style={{marginTop:8}}>Interface clara e minimalista para demonstrar validação de transações via IA. Use <strong>Enviar PIX</strong> para simular uma transferência.</p>

        <div style={{display:"flex", gap:16, marginTop:18}}>
          <div style={{flex:1}} className="card">
            <div style={{fontSize:12, color:"#6b7280"}}>Saldo disponível</div>
            <div style={{fontSize:22, fontWeight:800, marginTop:6}}>R$ 3.250,00</div>
            <div className="small" style={{marginTop:8}}>Conta: Conta de Teste • BR</div>
          </div>

          <div style={{width:220}} className="card">
            <div style={{fontSize:12, color:"#6b7280"}}>Última transação</div>
            <div style={{marginTop:6, fontWeight:700}}>R$ 120,00 → Loja Demo</div>
            <div className="small" style={{marginTop:8}}>Tudo ok</div>
          </div>
        </div>
      </div>
    </div>
  );
}
