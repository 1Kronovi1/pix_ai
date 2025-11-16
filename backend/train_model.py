# backend/train_model.py (atualizado)
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

# Ajuste se seu CSV estiver em outro local
CSV_PATH = "dataset_pix.csv"
MODEL_PATH = "model.joblib"
SCALER_PATH = "scaler.joblib"
BLACKLIST_PATH = "lista_negra.csv"

def build_features(df):
    # Carrega lista negra
    lista_negra_df = pd.read_csv(BLACKLIST_PATH)
    lista_negra_df.columns = ["conta", "suspeito"]

    # Espera colunas: remetente, destinatario, valor, historico_destinatario, golpe (opcional)
    # Cria agregações por remetente simples (média por remetente)
    ag = df.groupby("remetente")["valor"].agg(["mean","std","median","max","count"]).reset_index()
    ag.columns = ["remetente","avg_out","std_out","median_out","max_out","cnt_out"]

    df = df.merge(ag, on="remetente", how="left")

    # features básicas
    df["amount_zscore"] = (df["valor"] - df["avg_out"]) / (df["std_out"].replace(0, np.nan).fillna(1))
    df["has_no_history"] = (df["historico_destinatario"]==0).astype(int)
    df["is_large"] = (df["valor"] > 2*df["median_out"]).astype(int)
    df["reciprocity"] = 0  # se não tiver dados, manter 0

    # Merge com destinatário (lista negra)
    df = df.merge(lista_negra_df, left_on="destinatario", right_on="conta", how="left")
    df["suspeito_dest"] = df["suspeito"].fillna(0)

    # feature nova: valor relativo (valor / avg_out)
    df["avg_out_safe"] = df["avg_out"].replace(0, np.nan).fillna(1)
    df["valor_relativo"] = df["valor"] / df["avg_out_safe"]

    # LISTA DE FEATURES DA IA (agora inclui valor_relativo)
    features = [
        "valor",
        "amount_zscore",
        "has_no_history",
        "is_large",
        "historico_destinatario",
        "avg_out",
        "cnt_out",
        "suspeito_dest",
        "valor_relativo"
        ]
    # preencher NaNs
    X = df[features].fillna(0).values
    return X, df

def train():
    df = pd.read_csv(CSV_PATH)
    X, df_full = build_features(df)

    scaler = StandardScaler()
    Xs = scaler.fit_transform(X)

    clf = IsolationForest(
        n_estimators=200,
        contamination=0.10,
        random_state=42
    )

    clf.fit(Xs)

    joblib.dump(clf, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print("Modelo salvo com lista negra, features melhoradas e sensibilidade maior em", MODEL_PATH)

if __name__ == "__main__":
    train()
