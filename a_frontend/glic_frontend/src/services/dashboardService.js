import { dashboardMock } from "../mocks/dashboard";
import { vendasMock } from "../mocks/vendas";
import { receitasMock, despesasMock } from "../mocks/financeiro";
import { atrasoMock } from "./api";
import { statusVenda } from "../constants/vendas";

// TODO: substituir por chamada à API REST (Spring Boot)
export async function obterResumoDashboard(periodo = "hoje") {
  await atrasoMock();
  const agora = new Date();
  const dias = periodo === "7dias" ? 7 : periodo === "30dias" ? 30 : periodo === "personalizado" ? 30 : 1;
  const vendasPeriodo = vendasMock.filter((venda) => {
    const data = new Date(venda.data);
    return statusVenda(venda) === "finalizada" && (agora - data) / 86400000 < dias;
  });
  const faturamento = vendasPeriodo.reduce((total, venda) => total + venda.total, 0);
  const receitas = receitasMock.reduce((total, item) => total + item.valor, 0);
  const despesas = despesasMock.reduce((total, item) => total + item.valor, 0);
  const categorias = new Map(dashboardMock.faturamentoPorCategoria.map((item) => [item.nome, 0]));
  const servicos = new Map(dashboardMock.servicosMaisVendidos.map((item) => [item.nome, 0]));
  vendasPeriodo.forEach((venda) => venda.itens.forEach((item) => {
    const categoria = item.categoria || "Acessórios";
    categorias.set(categoria, (categorias.get(categoria) || 0) + item.preco * item.quantidade);
    const nome = item.configuracao?.servico || item.nome || "Serviço";
    servicos.set(nome, (servicos.get(nome) || 0) + item.quantidade);
  }));
  const faturamentoPorDia = Array.from({ length: 7 }, (_, indice) => {
    const data = new Date(agora);
    data.setDate(agora.getDate() - (6 - indice));
    const total = vendasPeriodo.filter((v) => new Date(v.data).toDateString() === data.toDateString()).reduce((s, v) => s + v.total, 0);
    return { nome: data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), valor: total };
  });
  return {
    faturamento,
    vendas: vendasPeriodo.length,
    ticketMedio: vendasPeriodo.length ? faturamento / vendasPeriodo.length : 0,
    descontos: vendasPeriodo.reduce((total, venda) => total + (venda.desconto || 0), 0),
    despesas,
    receitas,
    resultado: receitas - despesas,
    faturamentoPorDia,
    faturamentoPorCategoria: Array.from(categorias, ([nome, valor]) => ({ nome, valor })),
    servicosMaisVendidos: Array.from(servicos, ([nome, quantidade], i) => ({ id: `${nome}-${i}`, nome, quantidade })).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5)
  };
}
