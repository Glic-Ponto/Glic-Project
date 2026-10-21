import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });

try {
  const { default: ComprovanteVenda, dadosComprovanteValidos } = await server.ssrLoadModule("/src/components/vendas/ComprovanteVenda.jsx");
  const vendas = await server.ssrLoadModule("/src/services/vendasService.js");
  const { vendasMock } = await server.ssrLoadModule("/src/mocks/vendas.js");
  const venda = {
    id: "V-0042",
    status: "finalizada",
    data: "2026-10-20T15:30:00.000Z",
    usuarioId: "u-funcionario",
    usuarioNome: "Responsável real",
    cliente: null,
    veiculo: null,
    pagamento: "PIX",
    subtotal: 380,
    desconto: 20,
    total: 360,
    itens: [
      { id: "i-1", produtoId: "p-1", nome: "Película automotiva premium com nome extenso", quantidade: 2, preco: 180, total: 360, configuracao: { servico: "Instalação de insulfilm" } },
      { id: "i-2", produtoId: "p-2", nome: "Acessório", quantidade: 1, preco: 20, total: 20, configuracao: {} }
    ]
  };

  assert.equal(dadosComprovanteValidos(venda), true);
  assert.equal(dadosComprovanteValidos({ ...venda, itens: [] }), false);
  assert.equal(dadosComprovanteValidos({ ...venda, total: undefined }), false);

  const html = renderToStaticMarkup(createElement(ComprovanteVenda, { venda }));
  assert.match(html, /Comprovante de venda/);
  assert.match(html, /Documento não fiscal/);
  assert.match(html, /V-0042/);
  assert.match(html, /Película automotiva premium com nome extenso/);
  assert.match(html, /R\$.*180,00/);
  assert.match(html, /R\$.*360,00/);
  assert.match(html, /PIX/);
  assert.doesNotMatch(html, /Endereço|logradouro|bairro|CEP/);
  assert.doesNotMatch(html, /Comprador \/ Cliente/);

  vendasMock.push(venda);
  const copia = await vendas.obterVenda(venda.id);
  copia.itens[0].nome = "alterado fora do serviço";
  assert.equal(vendasMock[0].itens[0].nome, venda.itens[0].nome);
  await assert.rejects(vendas.obterVenda("V-inexistente"), erro => erro.codigo === "VENDA_NAO_ENCONTRADA");

  const css = await readFile(new URL("../src/components/vendas/ComprovanteVenda.css", import.meta.url), "utf8");
  assert.match(css, /@page\s*\{[^}]*size:\s*A4 portrait;[^}]*margin:\s*15mm;/s);
  assert.match(css, /@media print/);
  assert.match(css, /table-header-group/);
  assert.match(css, /break-inside:\s*avoid/);

  console.log("Aprovado: conteúdo, isolamento de dados, ausência de endereço e estilos A4 do comprovante.");
} finally {
  await server.close();
}
