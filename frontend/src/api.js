// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 8000,
});

export default api;

// ------------------------------
// Enviar transação para o backend
// ------------------------------
export async function analisarTransacao({ remetente, destinatario, valor }) {
  const form = new FormData();
  form.append("remetente", remetente);
  form.append("destinatario", destinatario);
  form.append("valor", valor);

  const resp = await api.post("/assess", form);
  return resp.data;
}
