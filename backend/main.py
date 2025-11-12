from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
import sqlite3
import random

app = FastAPI(title="PIX AI - Antifraude Simulado")

# --- Banco de dados ---
def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            remetente TEXT,
            destinatario TEXT,
            valor REAL,
            score REAL,
            status TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# --- Função simples de "IA" (simulação) ---
def analisar_transacao(valor, media_remetente, historico_destinatario):
    """
    Retorna um score de risco (0 a 1)
    Quanto mais perto de 1, mais suspeito.
    """
    # Regra simples simulada
    risco_valor = (valor / (media_remetente + 1)) * 0.6
    risco_destinatario = 0.4 if historico_destinatario == 0 else 0
    score = min(risco_valor + risco_destinatario, 1)
    return round(score, 2)

# --- Endpoint 1: Avaliação de risco ---
@app.post("/assess")
def assess(remetente: str = Form(...), destinatario: str = Form(...), valor: float = Form(...)):
    media_remetente = random.uniform(50, 800)  # simulação
    historico_destinatario = random.choice([0, 1, 2, 5])  # 0 = novo, 5 = histórico bom

    score = analisar_transacao(valor, media_remetente, historico_destinatario)

    status = "suspeito" if score > 0.7 else "seguro"

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO transacoes (remetente, destinatario, valor, score, status) VALUES (?, ?, ?, ?, ?)",
                   (remetente, destinatario, valor, score, status))
    conn.commit()
    conn.close()

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
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE transacoes SET status = 'confirmado' WHERE id = ?", (id_transacao,))
    conn.commit()
    conn.close()
    return {"mensagem": f"Transação {id_transacao} confirmada manualmente."}

# --- Endpoint 3: Logs de transações ---
@app.get("/logs")
def logs():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, remetente, destinatario, valor, score, status FROM transacoes ORDER BY id DESC")
    dados = cursor.fetchall()
    conn.close()
    return {"historico": dados}