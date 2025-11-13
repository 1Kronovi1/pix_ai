from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
from database import criar_tabela, inserir_transacao, listar_transacoes, atualizar_status

app = FastAPI(title="PIX AI - Antifraude Simulado")

# Permitir acesso do React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializa banco de dados
criar_tabela()

# --- Função de IA Simulada ---
def analisar_transacao(valor, media_remetente, historico_destinatario):
    risco_valor = (valor / (media_remetente + 1)) * 0.6
    risco_destinatario = 0.4 if historico_destinatario == 0 else 0
    score = min(risco_valor + risco_destinatario, 1)
    return round(score, 2)

# --- Endpoint 1: Avaliação de risco ---
@app.post("/assess")
def assess(remetente: str = Form(...), destinatario: str = Form(...), valor: float = Form(...)):
    media_remetente = random.uniform(50, 800)
    historico_destinatario = random.choice([0, 1, 2, 5])

    score = analisar_transacao(valor, media_remetente, historico_destinatario)
    status = "suspeito" if score > 0.7 else "seguro"

    inserir_transacao(remetente, destinatario, valor, score, status)

    return JSONResponse(content={
        "remetente": remetente,
        "destinatario": destinatario,
        "valor": valor,
        "score_risco": score,
        "status": status,
        "mensagem": "⚠️ Transação suspeita!" if status == "suspeito" else "✅ Transação segura."
    })

# --- Endpoint 2: Confirmação manual ---
@app.post("/confirm")
def confirm(id_transacao: int = Form(...)):
    atualizar_status(id_transacao, "confirmado")
    return {"mensagem": f"Transação {id_transacao} confirmada manualmente."}

# --- Endpoint 3: Histórico ---
@app.get("/logs")
def logs():
    historico = listar_transacoes()
    return {"historico": historico}

# --- Endpoint 4: Listar transações (para React) ---
@app.get("/transacoes")
def get_transacoes():
    transacoes = listar_transacoes()
    return {"transacoes": transacoes}
