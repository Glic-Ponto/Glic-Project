import { produtosMock, movimentacoesMock } from "../mocks/estoque";
import { atrasoMock } from "./api";

const chaveTexto = (valor) => valor.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
function textoProduto(valor, campo) {
  const texto = typeof valor === "string" ? valor.trim() : "";
  if (!texto) throw new Error(`Informe ${campo}.`);
  if (texto.length > 80) throw new Error(`${campo} deve ter no máximo 80 caracteres.`);
  const existente = produtosMock.find((produto) => chaveTexto(produto[campo]) === chaveTexto(texto));
  return existente?.[campo] || texto;
}

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
export async function cadastrarProduto(dados) {
  const produto = validarProduto(dados);
  await atrasoMock();
  const novoProduto = { id: `p-${crypto.randomUUID()}`, ...produto };
  produtosMock.push(novoProduto);
  return novoProduto;
}
export async function atualizarProduto(id, dados) {
  const indice = produtosMock.findIndex((produto) => produto.id === id);
  if (indice === -1) throw new Error("Produto não encontrado.");
  const produtoAtual = produtosMock[indice];
  const produto = validarProduto(dados);
  await atrasoMock();
  produtosMock[indice] = { ...produtoAtual, ...produto, id: produtoAtual.id };
  const diferencaQuantidade = produto.quantidade - produtoAtual.quantidade;
  if (diferencaQuantidade !== 0) {
    movimentacoesMock.push({ id: `mov-ajuste-${crypto.randomUUID()}`, produtoId: id, produto: produto.nome, tipo: "Ajuste de estoque", quantidade: diferencaQuantidade, data: new Date().toISOString() });
  }
  return produtosMock[indice];
}
function validarProduto(dados) {
  const nome = dados?.nome?.trim();
  const categoria = textoProduto(dados?.categoria, "categoria");
  const marca = textoProduto(dados?.marca, "marca");
  const quantidade = Number(dados?.quantidade);
  const preco = Number(dados?.preco);
  const minimo = Number(dados?.minimo);
  if (!nome) throw new Error("Informe o nome do produto.");
  if (!Number.isSafeInteger(quantidade) || quantidade < 0) throw new Error("Informe uma quantidade inteira não negativa.");
  if (!Number.isFinite(preco) || preco < 0) throw new Error("Informe um preço válido.");
  if (!Number.isSafeInteger(minimo) || minimo < 0) throw new Error("Informe um estoque mínimo inteiro não negativo.");
  if (!dados.unidade) throw new Error("Informe a unidade de medida.");
  return { nome, categoria, marca, quantidade, preco, minimo, unidade: dados.unidade, imagem: dados.imagem || null };
}
export function aplicarBaixaEstoque(itens, vendaId) {
  const porProduto = new Map();
  for (const item of itens) {
    if (!Number.isSafeInteger(item.quantidade) || item.quantidade < 1) throw new Error("Quantidade inválida para baixa de estoque.");
    porProduto.set(item.produtoId, (porProduto.get(item.produtoId) || 0) + item.quantidade);
  }
  for (const [produtoId, quantidade] of porProduto) {
    const produto = produtosMock.find((p) => p.id === produtoId);
    if (!produto || produto.quantidade < quantidade) {
      const nome = itens.find((item) => item.produtoId === produtoId)?.nome || "Produto";
      throw new Error(`Estoque insuficiente para ${nome}.`);
    }
  }
  for (const [produtoId, quantidade] of porProduto) {
    const produto = produtosMock.find((p) => p.id === produtoId);
    produto.quantidade -= quantidade;
    movimentacoesMock.push({ id: `mov-${vendaId}-${produtoId}`, vendaId, produtoId: produto.id, produto: produto.nome, tipo: "Saída por venda", quantidade, data: new Date().toISOString() });
  }
}
