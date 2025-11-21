# testar_pix.py
import requests
import random

BASE_URL = "http://127.0.0.1:8000"

destinatarios = ["LojaX", "MercadoA", "AmigoY", "GolpistaZ", "ContaFake"]
remetentes = ["Bruno", "Líbia", "Chris", "Gonçalves", "Gabriel"]
valores = [10, 20, 35, 50, 75, 100, 200, 300, 500, 800, 1000, 1500, 2500, 5000, 10000]

# =============================================
# 1. Limpar Histórico
# =============================================
try:
    requests.delete(f"{BASE_URL}/transacoes/limpar")
except:
    pass

# =============================================
# 2. Criar 200 transações aleatórias
# =============================================
total = 30
for _ in range(total):
    remetente = random.choice(remetentes)
    destinatario = random.choice(destinatarios)
    valor = random.choice(valores)

    data = {
        "remetente": remetente,
        "destinatario": destinatario,
        "valor": valor
    }

    try:
        requests.post(f"{BASE_URL}/assess", data=data)
    except:
        pass
