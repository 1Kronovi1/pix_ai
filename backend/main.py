# main.py (atualizado)
from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
import numpy as np
from joblib import load
import csv
import os
from datetime import datetime
from typing import Tuple

LOG_PATH = "transacoes_log.csv"

# ======================================================
# 📂 Criar arquivo de log caso não exista (atualizado com novas colunas)
# ======================================================
if not os.path.exists(LOG_PATH):
    with open(LOG_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "timestamp",
            "remetente",
            "destinatario",
            "valor",
            "valor_relativo",
            "score",
            "boost_aplicado",
            "status",
            "suspeito_dest"
        ])

# ======================================================
# 🧠 Carregar IA (modelo + scaler)
# ======================================================
modelo = load("model.joblib")
scaler = load("scaler.joblib")

# ======================================================
# 🚨 Lista negra (mantida)
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
    atualizar_status,
    DB_NAME  # para stats internos se necessário
)
# Importar helpers de stats
from stats import obter_media_remetente, obter_historico_destinatario

# ======================================================
# 🧠 Função: análise IA (agora inclui valor_relativo)
# ======================================================
def analisar_transacao_ml(valor, media_remetente, historico_destinatario, suspeito_dest, valor_relativo):
    """
    Reconstrói as features exatamente como no treino.
    OBS: precisa estar alinhado com train_model.py
    """

    # Proteções básicas
    avg_out = media_remetente if media_remetente is not None else 1.0
    std_out = 1
    median_out = media_remetente if media_remetente is not None else valor
    cnt_out = 1 if media_remetente is None else 1  # manter compatibilidade com antigo (treino espera cnt_out)

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
        suspeito_dest,
        valor_relativo
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
app = FastAPI(title="PIX AI - Antifraude Inteligente (V2 patch)")

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
    # ===== Estatísticas reais (substitui random)
    media_remetente = obter_media_remetente(remetente)
    # se não houver média histórica, usar fallback razoável (ex.: 100)
    if media_remetente is None:
        media_remetente = 100.0

    historico_destinatario = obter_historico_destinatario(destinatario)

    suspeito_dest = 1 if destinatario in lista_negra else 0

    # valor relativo (feature nova)
    valor_relativo = valor / (media_remetente if media_remetente > 0 else 1.0)

    # ======================================================
    # 🔥 BOOST DE RISCO REFINADO (graduais e explicitos)
    # ======================================================
    boost = 0.0

    # Penalização muito forte se estiver na lista negra
    if suspeito_dest == 1:
        boost += 0.40  # aumento da penalidade (era 0.25)

    # Valores muito altos + destinatário sem histórico
    if historico_destinatario == 0 and valor >= 8000:
        boost += 0.15

    # Redução de falso positivo para destinatário frequente (ajustado)
    if historico_destinatario >= 3 and valor <= 5000 and suspeito_dest == 0:
        boost -= 0.08  # leve redução

    # Proteção: se valor_relativo for pequeno (transação abaixo da média) dar redução leve
    if valor_relativo < 0.5 and suspeito_dest == 0:
        boost -= 0.03

    # ======================================================
    # 🧠 Rodar IA (passando valor_relativo)
    # ======================================================
    score, classe = analisar_transacao_ml(
        valor,
        media_remetente,
        historico_destinatario,
        suspeito_dest,
        valor_relativo
    )

    # Aplica boost ao score do modelo (score é negativo normalmente no isolation-forest scoring)
    score_final = score + boost

    # ======================================================
    # Threshold condicional (reduz falsos positivos)
    # ======================================================
    # Regras:
    # - Se destinatário está na lista negra => suspeito
    # - Se score_final > -0.55 e (valor_relativo > 2 ou valor > 2000) => suspeito
    # - Caso contrário => seguro
    if suspeito_dest == 1:
        status = "suspeito"
    elif (score_final > -0.55) and (valor_relativo > 2 or valor > 2000):
        status = "suspeito"
    else:
        status = "seguro"

    # Salvar no banco (usar score_final arredondado)
    inserir_transacao(remetente, destinatario, valor, round(float(score_final), 3), status)

    # ======================================================
    # 📝 SALVAR NO CSV DE LOGS PARA CALIBRAR A IA (com campos extras)
    # ======================================================
    with open(LOG_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            remetente,
            destinatario,
            float(valor),
            round(float(valor_relativo), 3),
            float(round(score_final, 3)),
            round(float(boost), 3),
            status,
            suspeito_dest
        ])

    return JSONResponse(content={
        "remetente": remetente,
        "destinatario": destinatario,
        "valor": valor,
        "valor_relativo": round(float(valor_relativo), 3),
        "score_risco": round(float(score_final), 3),
        "boost_aplicado": round(float(boost), 3),
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
# 📜 Histórico / Transações / Limpar logs (compatíveis)
# ======================================================
@app.get("/logs")
def logs():
    return {"historico": listar_transacoes()}


@app.get("/transacoes")
def get_transacoes():
    return {"transacoes": listar_transacoes()}

@app.delete("/clear_logs")
def clear_logs():
    # Recria o CSV com o cabeçalho original (com as novas colunas)
    with open(LOG_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "timestamp",
            "remetente",
            "destinatario",
            "valor",
            "valor_relativo",
            "score",
            "boost_aplicado",
            "status",
            "suspeito_dest"
        ])

    return JSONResponse(content={
        "mensagem": "Logs apagados com sucesso!"
    })
