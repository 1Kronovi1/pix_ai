import "./ConfirmModal.css"

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay">
            <div className="confirm-card">
                <p>{message}</p>

                <div className="confirm-buttons">
                    <button onClick={onConfirm} className="confirm-ok">Confirmar</button>
                    <button onClick={onCancel} className="confirm-cancel">Cancelar</button>
                </div>
            </div>
        </div>
    );

}