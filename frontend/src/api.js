// src/api.js
import axios from "axios";

// URL CORRETA DO BACKEND NA RENDER
const api = axios.create({
  baseURL: "https://pix-ai-back.onrender.com",
  timeout: 10000,
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
