# testar_pix.py
import requests

# URL do seu backend FastAPI
BASE_URL = "http://127.0.0.1:8000"  # ajuste a porta se necessário

# Destinatários do teste
destinatarios = ["LojaX", "MercadoA", "AmigoY", "GolpistaZ", "ContaFake"]

# Remetentes do teste
remetentes = ["Bruno", "Líbia", "Chris", "Gonçalves", "Gabriel"]

# Valores das transações
valores = [10, 100, 500, 1000, 10000]

# ================================
# 1. Limpar histórico antes do teste
# ================================
try:
    requests.delete(f"{BASE_URL}/transacoes/limpar")  # ou /clear_logs se não atualizou endpoint
except:
    pass  # não faz nada se der erro, apenas garantir limpeza

# ================================
# 2. Executar todas as transações
# ================================
for destinatario in destinatarios:
    for i, remetente in enumerate(remetentes):
        valor = valores[i]  # pega o valor correspondente
        data = {
            "remetente": remetente,
            "destinatario": destinatario,
            "valor": valor
        }
        try:
            requests.post(f"{BASE_URL}/assess", data=data)
        except:
            pass  # caso dê algum erro de rede, ignora para não travar o loop

# ================================
# 3. Teste completo
# ================================
# O backend grava automaticamente todas as transações no 'transacoes_log.csv'
# Nenhum output no console, como solicitado
