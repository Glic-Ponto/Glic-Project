import { vendasMock } from "../mocks/vendas";
import { receitasMock, despesasMock } from "../mocks/financeiro";
import { atrasoMock } from "./api";
import { statusVenda } from "../constants/vendas";

// Fuso provisório: usa o horário local do ambiente até a empresa defini-lo no back-end.
const inicioDia = (data) => new Date(data.getFullYear(), data.getMonth(), data.getDate());
const fimDia = (data) => new Date(data.getFullYear(), data.getMonth(), data.getDate(), 23, 59, 59, 999);
const dataChave = (data) => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
const dataLocal = (valor) => {
  const [ano, mes, dia] = (valor || "").split("-").map(Number);
  return Number.isInteger(ano) && Number.isInteger(mes) && Number.isInteger(dia) ? new Date(ano, mes - 1, dia) : null;
};
const noIntervalo = (valor, inicio, fim) => {
  const data = new Date(valor);
  return !Number.isNaN(data.getTime()) && data >= inicio && data <= fim;
};
const somar = (itens) => itens.reduce((total, item) => total + (Number(item.valor) || 0), 0);

export function obterIntervaloDashboard(periodo, personalizado, agora = new Date()) {
  if (periodo === "personalizado") {
    const inicio = dataLocal(personalizado?.inicio);
    const fim = dataLocal(personalizado?.fim);
    if (!inicio || !fim || fim < inicio) throw new Error("Informe um período personalizado válido.");
    return { inicio: inicioDia(inicio), fim: fimDia(fim), porHora: dataChave(inicio) === dataChave(fim) };
  }
  const dias = periodo === "30dias" ? 30 : periodo === "7dias" ? 7 : 1;
  const inicio = inicioDia(agora);
  inicio.setDate(inicio.getDate() - (dias - 1));
  return { inicio, fim: fimDia(agora), porHora: dias === 1 };
}

function criarSerie(intervalo) {
  if (intervalo.porHora) return Array.from({ length: 24 }, (_, hora) => ({ nome: `${String(hora).padStart(2, "0")}:00`, rotuloCompleto: `${dataChave(intervalo.inicio)} ${String(hora).padStart(2, "0")}:00`, valor: 0 }));
  const pontos = [];
  for (let data = inicioDia(intervalo.inicio); data <= intervalo.fim; data.setDate(data.getDate() + 1)) {
    const copia = new Date(data);
    pontos.push({ nome: copia.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), rotuloCompleto: copia.toLocaleDateString("pt-BR", { dateStyle: "full" }), valor: 0, chave: dataChave(copia) });
  }
  return pontos;
}

export async function obterResumoDashboard(periodo = "hoje", personalizado) {
  await atrasoMock();
  const intervalo = obterIntervaloDashboard(periodo, personalizado);
  const vendas = vendasMock.filter((venda) => statusVenda(venda) === "finalizada" && noIntervalo(venda.data, intervalo.inicio, intervalo.fim));
  const faturamento = vendas.reduce((total, venda) => total + (Number(venda.total) || 0), 0);
  const faturamentoPorDia = criarSerie(intervalo);
  const categorias = new Map();
  const servicos = new Map();
  vendas.forEach((venda) => {
    const data = new Date(venda.data);
    const ponto = intervalo.porHora ? faturamentoPorDia[data.getHours()] : faturamentoPorDia.find((item) => item.chave === dataChave(data));
    if (ponto) ponto.valor += Number(venda.total) || 0;
    (venda.itens || []).forEach((item) => {
      const valor = (Number(item.preco) || 0) * (Number(item.quantidade) || 0);
      const categoria = item.categoria || "Sem categoria";
      const servico = item.configuracao?.servico || item.nome || "Serviço não informado";
      categorias.set(categoria, (categorias.get(categoria) || 0) + valor);
      servicos.set(servico, (servicos.get(servico) || 0) + (Number(item.quantidade) || 0));
    });
  });
  const receitas = somar(receitasMock.filter((item) => noIntervalo(item.data, intervalo.inicio, intervalo.fim)));
  const despesas = somar(despesasMock.filter((item) => noIntervalo(item.data, intervalo.inicio, intervalo.fim)));
  return {
    intervalo, faturamento, vendas: vendas.length, ticketMedio: vendas.length ? faturamento / vendas.length : 0,
    descontos: vendas.reduce((total, venda) => total + (Number(venda.desconto) || 0), 0), receitas, despesas, resultado: receitas - despesas,
    faturamentoPorDia,
    faturamentoPorCategoria: Array.from(categorias, ([nome, valor]) => ({ nome, valor })).sort((a, b) => b.valor - a.valor),
    servicosMaisVendidos: Array.from(servicos, ([nome, quantidade], indice) => ({ id: `${nome}-${indice}`, nome, quantidade })).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5)
  };
}
