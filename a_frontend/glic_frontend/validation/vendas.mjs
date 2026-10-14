// Executa os módulos reais pelo Vite, sem dependências adicionais ou backend.
import assert from "node:assert/strict";
import { createServer } from "vite";
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
let verificacoes = 0;
try {
  const vendas = await server.ssrLoadModule("/src/services/vendasService.js");
  const { obterResumoDashboard } = await server.ssrLoadModule("/src/services/dashboardService.js");
  const { registrarReceitaVenda } = await server.ssrLoadModule("/src/services/financeiroService.js");
  const { produtosMock, movimentacoesMock } = await server.ssrLoadModule("/src/mocks/estoque.js");
  const { vendasMock } = await server.ssrLoadModule("/src/mocks/vendas.js");
  const { receitasMock } = await server.ssrLoadModule("/src/mocks/financeiro.js");
  const usuario = { id: "teste-funcionario", nome: "Funcionário mock de teste", perfil: "Funcionário" };
  const configuracao = { servico: "Instalação de insulfilm", tipoVeiculo: "Tipo A", area: "Área A" };
  const produto = produtosMock[0];
  const item = { produtoId: produto.id, preco: produto.preco, quantidade: 1, configuracao };
  const original = produto.quantidade;
  const dados = { operacaoId: "teste-rascunho", itens: [item], desconto: 10, configuracao };
  const rascunho = await vendas.salvarRascunho(dados, usuario);
  assert.equal(rascunho.status, "rascunho");
  assert.equal(produto.quantidade, original);
  assert.equal(receitasMock.length, 0);
  assert.equal(movimentacoesMock.length, 0);
  assert.equal((await obterResumoDashboard()).vendas, 0);
  assert.equal((await obterResumoDashboard()).faturamento, 0);
  assert.deepEqual((await vendas.obterRascunho(rascunho.id, usuario)).configuracao, configuracao);
  verificacoes++;
  const salvo = await vendas.salvarRascunho({ ...dados, id: rascunho.id, itens: [{ ...item, quantidade: 2 }] }, usuario);
  assert.equal(salvo.id, rascunho.id); assert.equal(vendasMock.length, 1);
  const copia = await vendas.listarVendas(); copia[0].itens[0].quantidade = 999;
  assert.equal(vendasMock[0].itens[0].quantidade, 2);
  verificacoes++;
  const finalizacoes = await Promise.all(Array.from({ length: 5 }, () => vendas.registrarVenda(salvo.itens, usuario, 10, { operacaoId: dados.operacaoId, rascunhoId: salvo.id, configuracao })));
  assert.ok(finalizacoes.every(v => v.id === salvo.id && v.status === "finalizada"));
  assert.equal(vendasMock.length, 1); assert.equal(receitasMock.length, 1); assert.equal(movimentacoesMock.length, 1);
  assert.equal(produto.quantidade, original - 2);
  assert.equal(receitasMock[0].valor, produto.preco * 2 - 10);
  registrarReceitaVenda(finalizacoes[0]); assert.equal(receitasMock.length, 1);
  const resumo = await obterResumoDashboard();
  assert.equal(resumo.vendas, 1); assert.equal(resumo.faturamento, produto.preco * 2 - 10);
  assert.equal(resumo.receitas, resumo.faturamento); assert.equal(resumo.ticketMedio, resumo.faturamento);
  assert.equal(resumo.descontos, 10); assert.equal(resumo.resultado, resumo.receitas - resumo.despesas);
  assert.equal(finalizacoes[0].cliente, null); assert.equal(finalizacoes[0].veiculo, null); assert.equal(finalizacoes[0].pagamento, null);
  verificacoes++;
  await assert.rejects(vendas.salvarRascunho({ ...dados, id: salvo.id }, usuario), /finalizada/);
  await assert.rejects(vendas.obterRascunho(salvo.id, usuario), /rascunho/);
  assert.equal((await vendas.registrarVenda(salvo.itens, usuario, 10, { operacaoId: "outra-chave", rascunhoId: salvo.id })).id, salvo.id);
  assert.equal(produto.quantidade, original - 2); verificacoes++;
  const snapshot = () => JSON.stringify({ quantidades: produtosMock.map(p => p.quantidade), vendas: vendasMock, receitas: receitasMock, movimentos: movimentacoesMock });
  const invalidos = [[], [null], [{ ...item, quantidade: 0 }], [{ ...item, quantidade: -1 }], [{ ...item, quantidade: 1.5 }], [{ ...item, quantidade: Infinity }], [{ ...item, quantidade: true }], [{ ...item, quantidade: original + 1 }], [{ ...item, preco: NaN }], [{ ...item, preco: Infinity }], [{ ...item, preco: -10 }], [{ ...item, preco: 1 }], [{ ...item, produtoId: "inexistente" }], [{ ...item, configuracao: { area: "Área Z" } }], [item, { ...item, produtoId: "inexistente" }], [{ ...item, quantidade: 6 }, { ...item, quantidade: 6, configuracao: { servico: "Instalação de acessórios" } }]];
  for (const [i, itens] of invalidos.entries()) {
    const antes = snapshot();
    await assert.rejects(vendas.registrarVenda(itens, usuario, 0, { operacaoId: "invalida-" + i }));
    assert.equal(snapshot(), antes); verificacoes++;
  }
  for (const [i, desconto] of [-1, NaN, Infinity, "", " ", null, true, produto.preco + 1].entries()) {
    const antes = snapshot();
    await assert.rejects(vendas.registrarVenda([item], usuario, desconto, { operacaoId: "desconto-" + i }));
    assert.equal(snapshot(), antes); verificacoes++;
  }
  const antes = snapshot();
  const pushOriginal = receitasMock.push;
  receitasMock.push = () => { throw new Error("Falha financeira simulada"); };
  try { await assert.rejects(vendas.registrarVenda([item], usuario, 0, { operacaoId: "rollback" }), /Falha financeira/); }
  finally { delete receitasMock.push; assert.equal(receitasMock.push, pushOriginal); }
  assert.equal(snapshot(), antes); verificacoes++;
  const diferentes = await vendas.registrarVenda([item, { ...item, configuracao: { ...configuracao, servico: "Instalação de acessórios" } }], usuario, 0, { operacaoId: "configuracoes" });
  assert.equal(diferentes.itens.length, 2);
  assert.equal(movimentacoesMock.filter(m => m.vendaId === diferentes.id).length, 1);
  assert.equal(produto.quantidade, original - 4); verificacoes++;
  const legado = { id: "V-0099", data: new Date().toISOString(), total: 50, itens: [{ ...item, preco: 50 }], usuarioId: usuario.id };
  vendasMock.push(legado);
  assert.equal((await obterResumoDashboard()).vendas, 3);
  assert.equal((await vendas.listarVendas()).find(v => v.id === legado.id).cliente, undefined);
  assert.equal((await vendas.salvarRascunho({ ...dados, operacaoId: "novo-id" }, usuario)).id, "V-0100"); verificacoes++;
  const gestor = { id: "teste-gestor", nome: "Gestor mock de teste", perfil: "Gestor" };
  const estoqueAntesGestor = produto.quantidade, receitasAntesGestor = receitasMock.length;
  const rascunhoGestor = await vendas.salvarRascunho({ ...dados, operacaoId: "gestor" }, gestor);
  assert.equal(rascunhoGestor.status, "rascunho");
  assert.equal(produto.quantidade, estoqueAntesGestor); assert.equal(receitasMock.length, receitasAntesGestor);
  const vendaGestor = await vendas.registrarVenda(rascunhoGestor.itens, gestor, rascunhoGestor.desconto, { operacaoId: "gestor", rascunhoId: rascunhoGestor.id, configuracao });
  assert.equal(vendaGestor.status, "finalizada"); assert.equal(vendaGestor.usuarioId, gestor.id);
  assert.equal(produto.quantidade, estoqueAntesGestor - 1); assert.equal(receitasMock.length, receitasAntesGestor + 1);
  await assert.rejects(vendas.registrarVenda([item], { ...gestor, perfil: "Visitante" }, 0, { operacaoId: "visitante" }), /funcionários e gestores/);
  await assert.rejects(vendas.obterRascunho("V-0100", { ...usuario, id: "outro" }), /outro funcionário/); verificacoes++;
  console.log("Aprovado: " + verificacoes + " cenários de serviço (rascunhos, idempotência, estoque, receita, rollback, valores inválidos, permissões e legado).");
} finally { await server.close(); }
