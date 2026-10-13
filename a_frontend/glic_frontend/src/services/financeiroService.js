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
  const receita = { id: `rec-${venda.id}`, vendaId: venda.id, descricao: `Venda ${venda.id}`, valor: venda.total, data: venda.data, categoria: "Vendas" };
  receitasMock.push(receita);
  return receita;
}
