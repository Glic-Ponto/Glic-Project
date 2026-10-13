import { produtosMock, movimentacoesMock } from "../mocks/estoque";
import { atrasoMock } from "./api";

export async function listarProdutos() {
  // TODO: substituir por chamada à API REST (Spring Boot)
  await atrasoMock();
  return produtosMock;
}
export async function obterProduto(id) {
  // TODO: substituir por chamada à API REST (Spring Boot)
  await atrasoMock();
  return produtosMock.find((produto) => produto.id === id) ?? null;
}
export function aplicarBaixaEstoque(itens, vendaId) {
  const porProduto = new Map();
  for (const item of itens) porProduto.set(item.produtoId, (porProduto.get(item.produtoId) || 0) + item.quantidade);
  for (const [produtoId, quantidade] of porProduto) {
    const produto = produtosMock.find((p) => p.id === produtoId);
    if (!produto || produto.quantidade < quantidade) {
      const nome = itens.find((item) => item.produtoId === produtoId)?.nome || "Produto";
      throw new Error(`Estoque insuficiente para ${nome}.`);
    }
  }
  for (const item of itens) {
    const produto = produtosMock.find((p) => p.id === item.produtoId);
    produto.quantidade -= item.quantidade;
    movimentacoesMock.push({ id: `mov-${Date.now()}-${item.produtoId}`, vendaId, produtoId: produto.id, produto: produto.nome, tipo: "Saída por venda", quantidade: item.quantidade, data: new Date().toISOString() });
  }
}
