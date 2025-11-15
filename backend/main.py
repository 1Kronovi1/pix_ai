from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
import numpy as np
from joblib import load
model = load("model.joblib")

# Funções do banco de dados
from database import (
    criar_tabela,
    inserir_transacao,
    listar_transacoes,
    atualizar_status
)

# ---------------------------------------------------------
# 🧠 Carregar modelo de IA treinado
# ---------------------------------------------------------
modelo = load("model.joblib")
scaler = load("scaler.joblib")

def analisar_transacao_ml(valor, media_remetente, historico_destinatario):
    """
    Reconstrói as MESMAS features usadas no treinamento.
    """
    # ======= FEATURES ORIGINAIS =======
    # valor
    # amount_zscore = (valor - avg_out) / std_out  (mas std_out não temos → usamos 1 como no treino)
    # has_no_history = 1 se historico_destinatario == 0
    # is_large = 1 se valor > 2 * median_out   (não temos median_out → aproximamos com media_remetente)
    # historico_destinatario
    # avg_out
    # cnt_out

    avg_out = media_remetente
    std_out = 1  # fallback igual ao do treino
    median_out = media_remetente  # aproximação segura
    cnt_out = 1  # sem histórico real, usamos 1

    amount_zscore = (valor - avg_out) / std_out
    has_no_history = 1 if historico_destinatario == 0 else 0
    is_large = 1 if valor > 2 * median_out else 0

    # Ordem EXATA usada no treino
    entrada = [
        valor,
        amount_zscore,
        has_no_history,
        is_large,
        historico_destinatario,
        avg_out,
        cnt_out
    ]

    entrada = np.array([entrada])  # 2D para o scaler

    entrada_norm = scaler.transform(entrada)

    score = modelo.score_samples(entrada_norm)[0]
    pred = modelo.predict(entrada_norm)[0]  # -1 = anomalia

    classe = "suspeita" if pred == -1 else "normal"
    return score, classe

# ---------------------------------------------------------
# 🚀 FastAPI
# ---------------------------------------------------------
app = FastAPI(title="PIX AI - Antifraude Inteligente")

# Permitir acesso do React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar tabela no banco, se não existir
criar_tabela()

# ---------------------------------------------------------
# 🔥 Endpoint 1 — Avaliação da transação
# ---------------------------------------------------------
@app.post("/assess")
def assess(remetente: str = Form(...), destinatario: str = Form(...), valor: float = Form(...)):

    # Em produção isso viria do banco
    media_remetente = random.uniform(50, 800)
    historico_destinatario = random.randint(0, 5)

    # IA REAL
    score, classe = analisar_transacao_ml(valor, media_remetente, historico_destinatario)

    status = "suspeito" if classe == 1 else "seguro"

    # Salvar no banco
    inserir_transacao(remetente, destinatario, valor, round(score, 3), status)

    return JSONResponse(content={
        "remetente": remetente,
        "destinatario": destinatario,
        "valor": valor,
        "score_risco": round(score, 3),
        "status": status,
        "mensagem": "⚠️ Transação suspeita!" if classe == 1 else "✅ Transação segura."
    })

# ---------------------------------------------------------
# Endpoint 2 — Confirmação manual pelo usuário
# ---------------------------------------------------------
@app.post("/confirm")
def confirm(id_transacao: int = Form(...)):
    atualizar_status(id_transacao, "confirmado")
    return {"mensagem": f"Transação {id_transacao} confirmada manualmente."}

# ---------------------------------------------------------
# Endpoint 3 — Histórico completo
# ---------------------------------------------------------
@app.get("/logs")
def logs():
    historico = listar_transacoes()
    return {"historico": historico}

# ---------------------------------------------------------
# Endpoint 4 — Listar transações (para frontend)
# ---------------------------------------------------------
@app.get("/transacoes")
def get_transacoes():
    transacoes = listar_transacoes()
    return {"transacoes": transacoes}
