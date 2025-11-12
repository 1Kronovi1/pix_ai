import pandas as pd
import random

# Gera dados simulando golpes e transações normais
def gerar_dados(n=100):
    dados = []
    for _ in range(n):
        remetente = random.choice(["Bruno", "Líbia", "Gonçalves", "Gabriel", "Chris"])
        destinatario = random.choice(["LojaX", "AmigoY", "GolpistaZ", "MercadoA", "ContaFake"])
        valor = round(random.uniform(10, 5000), 2)
        historico_destinatario = random.randint(0, 10)
        golpe = 1 if destinatario in ["GolpistaZ", "ContaFake"] or (valor > 2000 and historico_destinatario < 2) else 0
        dados.append([remetente, destinatario, valor, historico_destinatario, golpe])
    df = pd.DataFrame(dados, columns=["remetente", "destinatario", "valor", "historico_destinatario", "golpe"])
    df.to_csv("dataset_pix.csv", index=False)
    print("✅ Dataset gerado: dataset_pix.csv")

if __name__ == "__main__":
    gerar_dados(200)
