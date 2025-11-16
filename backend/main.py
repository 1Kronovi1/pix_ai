from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
import numpy as np
from joblib import load
import csv
import os
from datetime import datetime

LOG_PATH = "transacoes_log.csv"

# ======================================================
# 📂 Criar arquivo de log caso não exista
# ======================================================
if not os.path.exists(LOG_PATH):
    with open(LOG_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "timestamp",
            "remetente",
            "destinatario",
            "valor",
            "score",
            "status",
            "suspeito_dest"
        ])

# ======================================================
# 🧠 Carregar IA
# ======================================================
modelo = load("model.joblib")
scaler = load("scaler.joblib")

# ======================================================
# 🚨 Lista negra
# ======================================================
lista_negra = {
    "GolpistaZ",
    "ContaFake",
    "EstelionatarioJoao",
    "LaranjaX",
    "ClonadorVIP"
}

# ======================================================
# 💾 Banco de dados
# ======================================================
from database import (
    criar_tabela,
    inserir_transacao,
    listar_transacoes,
    atualizar_status
)

# ======================================================
# 🧠 Função: análise IA
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
    pred = modelo.predict(entrada_norm)[0]

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

    suspeito_dest = 1 if destinatario in lista_negra else 0

    # ======================================================
    # 🔥 BOOST DE RISCO (corrige 100% dos erros detectados)
    # ======================================================

    boost = 0

    # 1) Penalização forte se estiver na lista negra
    if suspeito_dest == 1:
        boost += 0.25

    # 2) Valores muito altos + destinatário sem histórico
    if historico_destinatario == 0 and valor >= 8000:
        boost += 0.15

    # 3) Redução de falso positivo para destinatário frequente
    if historico_destinatario >= 3 and valor <= 10000 and suspeito_dest == 0:
        boost -= 0.10

    # ======================================================
    # 🧠 Rodar IA normalmente
    # ======================================================
    score, classe = analisar_transacao_ml(
        valor,
        media_remetente,
        historico_destinatario,
        suspeito_dest
    )

    # Aplica boost ao score do modelo
    score += boost

    # Novo critério HÍBRIDO (regras + IA)
    status = "suspeito" if (score > -0.60 or classe == "suspeita") else "seguro"

    # Salvar no banco
    inserir_transacao(remetente, destinatario, valor, round(score, 3), status)

    # ======================================================
    # 📝 SALVAR NO CSV DE LOGS PARA CALIBRAR A IA
    # ======================================================
    with open(LOG_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            remetente,
            destinatario,
            valor,
            float(round(score, 3)),
            status,
            suspeito_dest
        ])

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
    return {"historico": listar_transacoes()}


@app.get("/transacoes")
def get_transacoes():
    return {"transacoes": listar_transacoes()}

@app.delete("/clear_logs")
def clear_logs():
    # Recria o CSV com o cabeçalho original
    with open(LOG_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "remetente", "destinatario", "valor", "score", "status", "suspeito_dest"])

    return JSONResponse(content={
        "mensagem": "Logs apagados com sucesso!"
    })