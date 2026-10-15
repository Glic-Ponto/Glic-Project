/*
 * TL02: linha de KPIs no topo, gráfico de faturamento em largura total,
 * dois painéis secundários lado a lado e totais financeiros na base.
 * A composição se empilha em telas menores conforme a grade responsiva.
 */
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import AcoesCabecalho from "../../components/layout/AcoesCabecalho/AcoesCabecalho";
import CartaoKpi from "../../components/ui/CartaoKpi/CartaoKpi";
import Graficos from "../../components/ui/Graficos/Graficos";
import ControleSegmentado from "../../components/ui/ControleSegmentado/ControleSegmentado";
import EstadoVazio from "../../components/ui/EstadoVazio/EstadoVazio";
import Botao from "../../components/ui/Botao/Botao";
import DialogoVenda from "../../components/vendas/DialogoVenda";
import { obterResumoDashboard } from "../../services/dashboardService";
import { textos } from "../../constants/textos";
import { useAuth } from "../../contexts/AuthContext";
import HistoricoFinanceiro from "./HistoricoFinanceiro";
import CalendarioPeriodo from "./CalendarioPeriodo";
import "./Dashboard.css";

const moeda = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);

export default function Dashboard() {
  const { usuario } = useAuth();
  const t = textos.dashboard;
  const [periodo, setPeriodo] = useState("hoje");
  const [periodoPersonalizado, setPeriodoPersonalizado] = useState(null);
  const [rascunhoPersonalizado, setRascunhoPersonalizado] = useState({ inicio: "", fim: "" });
  const [modalPeriodo, setModalPeriodo] = useState(false);
  const [erroPeriodo, setErroPeriodo] = useState("");
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    if (periodo === "personalizado" && !periodoPersonalizado) return;
    obterResumoDashboard(periodo, periodoPersonalizado).then((dados) => {
      if (ativo) { setResumo(dados); setErro(false); }
    }).catch(() => { if (ativo) setErro(true); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [periodo, periodoPersonalizado]);

  function alterarPeriodo(valor) {
    if (valor === "personalizado") { setRascunhoPersonalizado(periodoPersonalizado || { inicio: "", fim: "" }); setErroPeriodo(""); setModalPeriodo(true); return; }
    setPeriodo(valor);
  }
  function aplicarPeriodo() {
    if (!rascunhoPersonalizado.inicio || !rascunhoPersonalizado.fim) { setErroPeriodo("Selecione a data inicial e a data final."); return; }
    if (rascunhoPersonalizado.fim < rascunhoPersonalizado.inicio) { setErroPeriodo("A data final não pode ser anterior à data inicial."); return; }
    setPeriodoPersonalizado(rascunhoPersonalizado); setPeriodo("personalizado"); setModalPeriodo(false);
  }

  const kpis = [
    { titulo: t.faturamento, valor: moeda(resumo?.faturamento) },
    { titulo: t.vendasRealizadas, valor: String(resumo?.vendas ?? 0) },
    { titulo: t.ticketMedio, valor: moeda(resumo?.ticketMedio) },
    { titulo: t.descontos, valor: moeda(resumo?.descontos) }
  ];

  return <section className="pagina-dashboard" aria-labelledby="titulo-pagina">
    <AcoesCabecalho><ControleSegmentado rotulo="Período" opcoes={t.periodos} valor={periodo} onChange={alterarPeriodo} desabilitado={carregando} /></AcoesCabecalho>
    {erro && <div className="dashboard__erro" role="alert" aria-live="assertive"><AlertCircle aria-hidden="true" />{t.erroConexao}</div>}
    <div className="dashboard__kpis">
      {kpis.map((kpi) => <CartaoKpi key={kpi.titulo} titulo={kpi.titulo} valor={kpi.valor} carregando={carregando} />)}
    </div>
    <div className="dashboard__grafico-principal">
      {resumo && <Graficos titulo={t.faturamentoPeriodo} descricao={resumo.intervalo.porHora ? "Valores de faturamento por hora no período selecionado." : "Valores de faturamento por dia no período selecionado."} dados={resumo.faturamentoPorDia} tipo="linha" formatarValor={moeda} formatarRotulo={(valor, itens) => itens?.[0]?.payload?.rotuloCompleto || valor} />}
      {carregando && <div className="dashboard__esqueleto" aria-label="Carregando gráfico de faturamento" />}
    </div>
    <div className="dashboard__graficos-secundarios">
      {resumo && <Graficos titulo={t.faturamentoCategoria} descricao="Distribuição do faturamento por categoria de produto." dados={resumo.faturamentoPorCategoria} tipo="barra" formatarValor={moeda} />}
      <section className="dashboard__ranking" aria-labelledby="dashboard-ranking-titulo">
        <h2 id="dashboard-ranking-titulo">{t.servicosMaisVendidos}</h2>
        {carregando ? <div className="dashboard__esqueleto" aria-label="Carregando ranking" /> : resumo?.servicosMaisVendidos.some((item) => item.quantidade > 0) ?
          <ol>{resumo.servicosMaisVendidos.map((item) => <li key={item.id}><span>{item.nome}</span><strong>{item.quantidade}</strong></li>)}</ol> :
          <EstadoVazio texto="Nenhum serviço vendido no período." />}
      </section>
    </div>
    <section className="dashboard__totais" aria-label="Totais financeiros">
      <div><span>{t.receitas}</span><strong>{moeda(resumo?.receitas)}</strong></div>
      <div><span>{t.despesas}</span><strong>{moeda(resumo?.despesas)}</strong></div>
      <div><span>{t.resultado}</span><strong>{moeda(resumo?.resultado)}</strong></div>
    </section>
    {usuario?.perfil === "Gestor" && <HistoricoFinanceiro />}
    {modalPeriodo && <DialogoVenda titulo="Período personalizado" onFechar={() => setModalPeriodo(false)} classe="dashboard__dialogo-periodo">
      <p>Selecione a data inicial e a data final para o gráfico.</p>
      <div className="dashboard__datas"><label>Data inicial<input type="date" value={rascunhoPersonalizado.inicio} onChange={e => { setRascunhoPersonalizado(atual => ({ ...atual, inicio: e.target.value })); setErroPeriodo(""); }} /></label><label>Data final<input type="date" value={rascunhoPersonalizado.fim} onChange={e => { setRascunhoPersonalizado(atual => ({ ...atual, fim: e.target.value })); setErroPeriodo(""); }} /></label></div>
      <CalendarioPeriodo inicio={rascunhoPersonalizado.inicio} fim={rascunhoPersonalizado.fim} aoSelecionar={dados => { setRascunhoPersonalizado(dados); setErroPeriodo(""); }} />
      {rascunhoPersonalizado.inicio && rascunhoPersonalizado.fim && <p className="dashboard__periodo-resumo">Período: {rascunhoPersonalizado.inicio.split("-").reverse().join("/")} a {rascunhoPersonalizado.fim.split("-").reverse().join("/")}.</p>}
      {erroPeriodo && <p className="dashboard__periodo-erro" role="alert">{erroPeriodo}</p>}
      <div className="dialogo-venda__acoes"><Botao variante="secundario" onClick={() => setModalPeriodo(false)}>Cancelar</Botao><Botao onClick={aplicarPeriodo}>Aplicar período</Botao></div>
    </DialogoVenda>}
  </section>;
}
