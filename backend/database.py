# database.py
import sqlite3

DB_NAME = "database.db"

def conectar():
    """Cria e retorna uma conexão com o banco SQLite."""
    return sqlite3.connect(DB_NAME)

def criar_tabela():
    """Cria a tabela de transações caso não exista."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            remetente TEXT NOT NULL,
            destinatario TEXT NOT NULL,
            valor REAL NOT NULL,
            score REAL NOT NULL,
            status TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def inserir_transacao(remetente, destinatario, valor, score, status):
    """Insere uma nova transação no banco."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO transacoes (remetente, destinatario, valor, score, status)
        VALUES (?, ?, ?, ?, ?)
    """, (remetente, destinatario, valor, score, status))
    conn.commit()
    conn.close()

def listar_transacoes():
    """Retorna todas as transações registradas."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT id, remetente, destinatario, valor, score, status FROM transacoes ORDER BY id DESC")
    transacoes = cursor.fetchall()
    conn.close()
    return transacoes

def atualizar_status(id_transacao, novo_status):
    """Atualiza o status de uma transação específica."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("UPDATE transacoes SET status = ? WHERE id = ?", (novo_status, id_transacao))
    conn.commit()
    conn.close()
