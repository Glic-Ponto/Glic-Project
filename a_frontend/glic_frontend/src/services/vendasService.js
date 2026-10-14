import { vendasMock } from "../mocks/vendas";
import { produtosMock, movimentacoesMock } from "../mocks/estoque";
import { receitasMock } from "../mocks/financeiro";
import { atrasoMock } from "./api";
import { aplicarBaixaEstoque } from "./estoqueService";
import { registrarReceitaVenda } from "./financeiroService";
import { tiposServico, tiposVeiculo, areasAplicacao, statusVenda } from "../constants/vendas";

const copiar = (valor) => structuredClone(valor);
const centavos = (valor) => Math.round(valor * 100);
const numeroValido = valor => typeof valor === "number" || (typeof valor === "string" && valor.trim() !== "") ? Number(valor) : NaN;
const operacoes = new Map();
const proximoId = () => "V-" + String(Math.max(0, ...vendasMock.map(v => Number(v.id?.replace(/^V-/, "")) || 0)) + 1).padStart(4, "0");

function validarUsuario(usuario) {
  if (!usuario?.id || !["Funcionário", "Gestor"].includes(usuario.perfil)) throw new Error("Somente funcionários e gestores podem registrar vendas.");
}
function configurar(valor = {}) {
  const resultado = {};
  for (const [chave, opcoes] of [["servico", tiposServico], ["tipoVeiculo", tiposVeiculo], ["area", areasAplicacao]]) {
    resultado[chave] = valor?.[chave] || "";
    if (resultado[chave] && !opcoes.includes(resultado[chave])) throw new Error("Configuração da venda inválida.");
  }
  return resultado;
}
function preparar(itens, desconto, configuracao, rascunho) {
  if (!Array.isArray(itens) || (!rascunho && !itens.length)) throw new Error("Adicione ao menos um item para finalizar a venda.");
  const normalizados = itens.map((item, indice) => {
    const produto = produtosMock.find(p => p.id === item?.produtoId);
    const quantidade = numeroValido(item?.quantidade), preco = numeroValido(item?.preco);
    if (!produto || !Number.isSafeInteger(quantidade) || quantidade < 1 || item.preco === "" || item.preco == null || !Number.isFinite(preco) || preco < 0 || !Number.isSafeInteger(centavos(preco) * quantidade)) {
      throw new Error("A venda contém produto, quantidade ou preço inválido.");
    }
    // Um único catálogo; nenhuma cobrança adicional por serviço ou área.
    if (centavos(preco) !== centavos(produto.preco)) throw new Error("Confira o preço atual de " + produto.nome + " antes de continuar.");
    return { id: item.id || "item-" + indice, produtoId: produto.id, nome: produto.nome, categoria: produto.categoria, unidade: produto.unidade, quantidade, preco: centavos(preco) / 100, total: centavos(preco) * quantidade / 100, configuracao: configurar(item.configuracao) };
  });
  const subtotalCentavos = normalizados.reduce((s, item) => s + centavos(item.total), 0);
  const numero = numeroValido(desconto);
  if (!Number.isSafeInteger(subtotalCentavos) || desconto == null || desconto === "" || !Number.isFinite(numero) || numero < 0 || numero > subtotalCentavos / 100) throw new Error("Informe um desconto entre zero e o subtotal.");
  const descontoCentavos = centavos(numero);
  return { itens: normalizados, subtotal: subtotalCentavos / 100, desconto: descontoCentavos / 100, total: (subtotalCentavos - descontoCentavos) / 100, configuracao: configurar(configuracao) };
}
function encontrar(id, usuario) {
  if (!id) return null;
  const venda = vendasMock.find(v => v.id === id);
  if (!venda) throw new Error("Rascunho não encontrado. Os dados mock são reiniciados ao recarregar a página.");
  if (venda.usuarioId !== usuario.id) throw new Error("Este rascunho pertence a outro funcionário.");
  return venda;
}
function chaveOperacao(operacaoId, usuario) {
  if (typeof operacaoId !== "string" || !operacaoId.trim()) throw new Error("Identificador da operação ausente. Inicie uma nova venda.");
  return usuario.id + ":" + operacaoId;
}
export async function listarVendas() {
  await atrasoMock();
  return copiar([...vendasMock].sort((a, b) => new Date(b.data) - new Date(a.data)));
}
export async function obterRascunho(id, usuario) {
  validarUsuario(usuario);
  await atrasoMock();
  const venda = encontrar(id, usuario);
  if (!venda || statusVenda(venda) !== "rascunho") throw new Error("Esta venda não é um rascunho disponível para edição.");
  return copiar(venda);
}
export async function salvarRascunho(dados, usuario) {
  validarUsuario(usuario);
  const chave = chaveOperacao(dados.operacaoId, usuario);
  await atrasoMock();
  const existente = encontrar(dados.id, usuario) || vendasMock.find(v => v.operacaoId === dados.operacaoId && v.usuarioId === usuario.id);
  if (operacoes.has(chave) || (existente && statusVenda(existente) !== "rascunho")) throw new Error("Esta venda já foi finalizada.");
  const valores = preparar(dados.itens, dados.desconto, dados.configuracao, true);
  const rascunho = { ...existente, ...valores, id: existente?.id || proximoId(), operacaoId: dados.operacaoId, status: "rascunho", data: new Date().toISOString(), usuarioId: usuario.id, usuarioNome: usuario.nome, cliente: existente?.cliente ?? null, veiculo: existente?.veiculo ?? null, pagamento: existente?.pagamento ?? null };
  if (existente) vendasMock[vendasMock.indexOf(existente)] = rascunho;
  else vendasMock.push(rascunho);
  return copiar(rascunho);
}
export async function registrarVenda(itens, usuario, desconto = 0, opcoes = {}) {
  validarUsuario(usuario);
  const chave = chaveOperacao(opcoes.operacaoId, usuario);
  // Após a espera, validação e commit são síncronos. Uma chamada concorrente
  // encontra o resultado pronto antes de tentar aplicar os efeitos novamente.
  await atrasoMock();
  if (operacoes.has(chave)) return copiar(operacoes.get(chave));
  const existente = encontrar(opcoes.rascunhoId, usuario) || vendasMock.find(v => v.operacaoId === opcoes.operacaoId && v.usuarioId === usuario.id);
  if (existente && statusVenda(existente) !== "rascunho") return copiar(existente);
  const valores = preparar(itens, desconto, opcoes.configuracao, false);
  const venda = { ...existente, ...valores, id: existente?.id || proximoId(), operacaoId: opcoes.operacaoId, status: "finalizada", data: new Date().toISOString(), usuarioId: usuario.id, usuarioNome: usuario.nome, cliente: existente?.cliente ?? null, veiculo: existente?.veiculo ?? null, pagamento: existente?.pagamento ?? null };
  const quantidades = produtosMock.map(p => p.quantidade);
  const movimentosAntes = movimentacoesMock.length, receitasAntes = receitasMock.length;
  try {
    aplicarBaixaEstoque(venda.itens, venda.id);
    registrarReceitaVenda(venda);
    if (existente) vendasMock[vendasMock.indexOf(existente)] = venda;
    else vendasMock.push(venda);
    operacoes.set(chave, copiar(venda));
    return copiar(venda);
  } catch (erro) {
    produtosMock.forEach((p, i) => { p.quantidade = quantidades[i]; });
    movimentacoesMock.splice(movimentosAntes);
    receitasMock.splice(receitasAntes);
    throw erro;
  }
}
