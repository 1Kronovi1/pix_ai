import "./WelcomeModal.css";

export default function WelcomeModal({ onClose }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <h2>👋 Bem-vindo!</h2>

        <p>
          Esta é uma aplicação demonstrativa criada para mostrar o funcionamento
          da minha inteligência artificial que analisa transações PIX e avalia se
          são <strong>seguras</strong> ou <strong>suspeitas</strong>.
        </p>

        <p>
          <strong>Modo de uso:</strong><br/>
          Vá até a aba <strong>Transferência</strong>, informe seu nome e escolha
          um destinatário existente do nosso "banco digital" de teste.
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

        <button className="welcome-btn" onClick={onClose}>
          Entendi 👍
        </button>
      </div>
    </div>
  );
}
