const API_URL = import.meta.env.VITE_API_URL || "";

export async function requisicao(caminho, opcoes = {}) {
  // TODO: integrar com a API
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers }
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  if (resposta.status === 204) return null;
  return resposta.json();
}
export const atrasoMock = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
