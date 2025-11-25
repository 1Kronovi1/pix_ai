import "./WelcomeModal.css";
import catWelcome from  "../images/catWelcome.png"

export default function WelcomeModal({ onClose }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <div className="welcome-top-container" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <img src={ catWelcome } style={{width: "140px", alignSelf: "center"}} alt="" />
          <h2 style={{ alignSelf: "center", color: "var(--purple)" }}>Bem-vindo!</h2>
        </div>

        <p style={{ lineHeight: "20px" }}>
          Esta é uma aplicação demonstrativa criada para mostrar o funcionamento
          da minha inteligência artificial que analisa transações PIX e avalia se
          são <strong style={{color: "red"}}>seguras</strong> ou <strong style={{color: "green"}}>seguras</strong>.
        </p>

        <p>
          <strong style={{color: "var(--purple)", fontWeight: "800"}}>Modo de uso:</strong><br/><br/>
          Vá até a aba <strong>Transferência</strong>, informe seu nome e escolha
          um destinatário <strong style={{color: "var(--purple)"}}>existente</strong> do nosso "banco digital" de teste.
        </p>

        <p>A IA analisará o comportamento do destinatário e exibirá o resultado.</p>

        <h3 style={{ marginTop: 18 }}>Usuários disponíveis:</h3>

        <ul className="user-list">
          <li className="safe">LojaX (Seguro)</li>
          <li className="safe">MercadoA (Seguro)</li>
          <li className="safe">AmigoY (Seguro)</li>
          <li className="danger">ContaFake (Suspeito)</li>
          <li className="danger">GolpistaZ (Suspeito)</li>
        </ul>

        <button style={{backgroundColor: "var(--purple)"}} className="welcome-btn" onClick={onClose}>
          Entendi!
        </button>
      </div>
    </div>
  );
}
