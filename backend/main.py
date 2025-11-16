from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
import numpy as np
from joblib import load

# -------------------------------
# Carregar IA
# -------------------------------
modelo = load("model.joblib")
scaler = load("scaler.joblib")

# -------------------------------
# Lista negra (mesmo conteúdo do CSV)
# -------------------------------
lista_negra = {
    "GolpistaZ",
    "ContaFake",
    "EstelionatarioJoao",
    "LaranjaX",
    "ClonadorVIP"
}

# -------------------------------
# Banco de dados
# -------------------------------
from database import (
    criar_tabela,
    inserir_transacao,
    listar_transacoes,
    atualizar_status
)

# ======================================================
# 🧠 Função: Analisar transação via ML (8 features)
# ======================================================
def analisar_transacao_ml(valor, media_remetente, historico_destinatario, suspeito_dest):
    """
    Reconstrói exatamente as features do treino.
    """

    avg_out = media_remetente
    std_out = 1
    median_out = media_remetente
    cnt_out = 1

    amount_zscore = (valor - avg_out) / std_out
    has_no_history = 1 if historico_destinatario == 0 else 0
    is_large = 1 if valor > 2 * median_out else 0

    # ORDEM EXATA DO TREINO
    entrada = [
        valor,
        amount_zscore,
        has_no_history,
        is_large,
        historico_destinatario,
        avg_out,
        cnt_out,
        suspeito_dest
    ]

    entrada = np.array([entrada])
    entrada_norm = scaler.transform(entrada)

    score = modelo.score_samples(entrada_norm)[0]
    pred = modelo.predict(entrada_norm)[0]   # -1 = suspeito, 1 = normal

    classe = "suspeita" if pred == -1 else "normal"
    return score, classe


# ======================================================
# 🚀 FastAPI
# ======================================================
app = FastAPI(title="PIX AI - Antifraude Inteligente")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

criar_tabela()

# ======================================================
# 🔥 Endpoint — Avaliação da transação
# ======================================================
@app.post("/assess")
def assess(
    remetente: str = Form(...),
    destinatario: str = Form(...),
    valor: float = Form(...)
):

    # Em produção → viria do banco
    media_remetente = random.uniform(50, 800)
    historico_destinatario = random.randint(0, 5)

    # Detectar se está na lista negra
    suspeito_dest = 1 if destinatario in lista_negra else 0

    # Rodar IA
    score, classe = analisar_transacao_ml(
        valor,
        media_remetente,
        historico_destinatario,
        suspeito_dest
    )

    status = "suspeito" if classe == "suspeita" else "seguro"

    # Salvar no banco
    inserir_transacao(remetente, destinatario, valor, round(score, 3), status)

    return JSONResponse(content={
        "remetente": remetente,
        "destinatario": destinatario,
        "valor": valor,
        "score_risco": round(score, 3),
        "status": status,
        "mensagem": "⚠️ Transação suspeita!" if status == "suspeito" else "✅ Transação segura."
    })


# ======================================================
# 👤 Confirmação manual
# ======================================================
@app.post("/confirm")
def confirm(id_transacao: int = Form(...)):
    atualizar_status(id_transacao, "confirmado")
    return {"mensagem": f"Transação {id_transacao} confirmada manualmente."}


# ======================================================
# 📜 Histórico
# ======================================================
@app.get("/logs")
def logs():
    historico = listar_transacoes()
    return {"historico": historico}


@app.get("/transacoes")
def get_transacoes():
    transacoes = listar_transacoes()
    return {"transacoes": transacoes}
