import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const fetchOriginal = globalThis.fetch;

try {
  const estoque = await server.ssrLoadModule("/src/services/estoqueService.js");
  const { produtosMock, movimentacoesMock } = await server.ssrLoadModule("/src/mocks/estoque.js");
  const base = {
    nome: "Produto fornecedor teste",
    categoria: "Acessórios",
    marca: "Marca livre",
    fornecedor: "  Glic Distribuidora  ",
    quantidade: 7,
    preco: 149.90,
    minimo: 2,
    unidade: "un.",
    imagem: null
  };

  const requisicoes = [];
  globalThis.fetch = async (url, opcoes = {}) => {
    requisicoes.push({ url: String(url), opcoes, corpo: opcoes.body ? JSON.parse(opcoes.body) : null });
    const corpoRecebido = opcoes.body ? JSON.parse(opcoes.body) : base;
    const resposta = { id: 77, ...corpoRecebido };
    return new Response(JSON.stringify(opcoes.method ? resposta : [resposta]), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  await estoque.listarProdutos();
  const cadastradoNaApi = await estoque.cadastrarProduto({ ...base, nome: "Produto API", fornecedor: "Fornecedor API" });
  assert.equal(requisicoes.at(-1).url.endsWith("/produtos"), true);
  assert.equal(requisicoes.at(-1).opcoes.method, "POST");
  assert.equal(requisicoes.at(-1).corpo.fornecedor, "Fornecedor API");
  const atualizadoNaApi = await estoque.atualizarProduto(cadastradoNaApi.id, { ...base, nome: "Produto API", fornecedor: "Fornecedor API atualizado" });
  assert.equal(requisicoes.at(-1).url.endsWith("/produtos/77"), true);
  assert.equal(requisicoes.at(-1).opcoes.method, "PUT");
  assert.equal(requisicoes.at(-1).corpo.fornecedor, "Fornecedor API atualizado");
  assert.equal(atualizadoNaApi.quantidade, base.quantidade);

  globalThis.fetch = async () => { throw new TypeError("API indisponível no teste do fallback mock."); };
  await estoque.listarProdutos();

  const cadastrado = await estoque.cadastrarProduto(base);
  assert.equal(cadastrado.fornecedor, "Glic Distribuidora");
  assert.equal(cadastrado.quantidade, 7);

  const movimentosAntes = movimentacoesMock.length;
  const atualizado = await estoque.atualizarProduto(cadastrado.id, { ...base, fornecedor: "Distribuidora Central" });
  assert.equal(atualizado.fornecedor, "Distribuidora Central");
  assert.equal(atualizado.quantidade, cadastrado.quantidade);
  assert.equal(atualizado.preco, cadastrado.preco);
  assert.equal(movimentacoesMock.length, movimentosAntes, "Alterar somente fornecedor não pode criar ajuste de estoque.");

  const semFornecedor = await estoque.cadastrarProduto({ ...base, nome: "Produto sem fornecedor", fornecedor: "   " });
  assert.equal(semFornecedor.fornecedor, null);
  await assert.rejects(estoque.cadastrarProduto({ ...base, fornecedor: "x".repeat(101) }), /máximo 100/);

  const pagina = await readFile(new URL("../src/pages/Estoque/Estoque.jsx", import.meta.url), "utf8");
  assert.match(pagina, /<label>Fornecedor<input/);
  assert.match(pagina, /Fornecedor do produto/);
  assert.match(pagina, /produtoAtual\.fornecedor/);
  assert.doesNotMatch(pagina, />Histórico de movimentações</);
  assert.doesNotMatch(pagina, />Atualizar estoque</);
  assert.doesNotMatch(pagina, /Unidade de medida: un\./);

  produtosMock.splice(produtosMock.findIndex(produto => produto.id === cadastrado.id), 1);
  produtosMock.splice(produtosMock.findIndex(produto => produto.id === semFornecedor.id), 1);
  console.log("Aprovado: cadastro, edição, validação e apresentação de fornecedor no estoque.");
} finally {
  globalThis.fetch = fetchOriginal;
  await server.close();
}
