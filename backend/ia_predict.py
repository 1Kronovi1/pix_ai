import joblib
import json
import sys
import numpy as np

# Carregar o modelo e o scaler
model = joblib.load("model.joblib")
scaler = joblib.load("scaler.joblib")

# Receber dados enviados pelo Node (via argv)
entrada = json.loads(sys.argv[1])

# Criar vetor com as 4 features
features = np.array([[
    entrada["valor"],
    entrada["estabelecimento"],
    entrada["categoria"],
    entrada["hora"]
]])

# Normalizar
features_scaled = scaler.transform(features)

# Fazer predição (0 seguro / 1 golpe)
resultado = int(model.predict(features_scaled)[0])

print(resultado)
