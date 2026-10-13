import { vendasMock } from "../mocks/vendas";
import { atrasoMock } from "./api";
import { aplicarBaixaEstoque } from "./estoqueService";
import { registrarReceitaVenda } from "./financeiroService";

export async function listarVendas() {
  await atrasoMock();
  return [...vendasMock].sort((a, b) => new Date(b.data) - new Date(a.data));
}

export async function registrarVenda(itens, usuario, desconto = 0) {
  await atrasoMock(350);
  if (!Array.isArray(itens) || !itens.length) throw new Error("Adicione ao menos um item para finalizar a venda.");
  const normalizados = itens.map((item) => ({
    ...item,
    quantidade: Number(item.quantidade),
    preco: Number(item.preco)
  }));
  if (normalizados.some((item) => !item.produtoId || !Number.isInteger(item.quantidade) || item.quantidade < 1 || !Number.isFinite(item.preco) || item.preco < 0)) {
    throw new Error("Revise os itens e as quantidades da venda.");
  }
  const subtotal = normalizados.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const descontoSeguro = Number(desconto) || 0;
  if (descontoSeguro < 0 || descontoSeguro > subtotal) throw new Error("O desconto deve estar entre R$ 0,00 e o subtotal.");
  const id = `V-${String(vendasMock.length + 1).padStart(4, "0")}`;
  const venda = {
    id, data: new Date().toISOString(),
    itens: normalizados.map((item) => ({ ...item, total: item.preco * item.quantidade })),
    subtotal, desconto: descontoSeguro, total: subtotal - descontoSeguro,
    usuarioId: usuario?.id ?? null,
    usuarioNome: usuario?.nome ?? "Usuário"
  };
  // aplicarBaixaEstoque valida todos os itens antes de alterar o estoque.
  aplicarBaixaEstoque(venda.itens, id);
  vendasMock.push(venda);
  registrarReceitaVenda(venda);
  return venda;
}
