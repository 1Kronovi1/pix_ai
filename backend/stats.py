# stats.py
import sqlite3
from database import DB_NAME

def conectar_local():
    return sqlite3.connect(DB_NAME)

def obter_media_remetente(remetente):
    """
    Retorna a média histórica de valores enviados pelo remetente.
    Se não houver registros retorna None.
    """
    conn = conectar_local()
    cur = conn.cursor()
    cur.execute("SELECT AVG(valor) FROM transacoes WHERE remetente = ?", (remetente,))
    r = cur.fetchone()
    conn.close()
    if r and r[0] is not None:
        return float(r[0])
    return None

def obter_historico_destinatario(destinatario):
    """
    Retorna a quantidade de transações registradas para o destinatário.
    """
    conn = conectar_local()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM transacoes WHERE destinatario = ?", (destinatario,))
    r = cur.fetchone()
    conn.close()
    return int(r[0]) if r else 0
