import { receitasMock, despesasMock } from "../mocks/financeiro";
import { atrasoMock } from "./api";

export async function listarReceitas() {
  await atrasoMock();
  return [...receitasMock].sort((a, b) => new Date(b.data) - new Date(a.data));
}
export async function listarDespesas() {
  await atrasoMock();
  return [...despesasMock].sort((a, b) => new Date(b.data) - new Date(a.data));
}
export function registrarReceitaVenda(venda) {
  if (venda.status === "rascunho" || !Number.isFinite(venda.total) || venda.total < 0) throw new Error("Somente vendas finalizadas com valor válido podem gerar receitas.");
  const existente = receitasMock.find(r => r.vendaId === venda.id);
  if (existente) return existente;
  const receita = { id: `rec-${venda.id}`, vendaId: venda.id, descricao: `Venda ${venda.id}`, valor: venda.total, data: venda.data, categoria: "Vendas" };
  receitasMock.push(receita);
  return receita;
}
