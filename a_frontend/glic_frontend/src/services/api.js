const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers }
  });
  if (!resposta.ok) {
    const erro = new Error(`HTTP ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }
  if (resposta.status === 204) return null;
  return resposta.json();
}
export const atrasoMock = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
