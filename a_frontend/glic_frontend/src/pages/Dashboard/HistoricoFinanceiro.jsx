import { useEffect, useState } from "react";
import { listarReceitas, listarDespesas } from "../../services/financeiroService";
import Tabela from "../../components/ui/Tabela/Tabela";
import ControleSegmentado from "../../components/ui/ControleSegmentado/ControleSegmentado";

export default function HistoricoFinanceiro() {
  const [dados, setDados] = useState({ receitas: [], despesas: [] });
  const [tipo, setTipo] = useState("receitas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  useEffect(() => {
    let ativo = true;
    Promise.all([listarReceitas(), listarDespesas()]).then(([receitas, despesas]) => { if (ativo) setDados({ receitas, despesas }); })
      .catch(() => { if (ativo) setErro("Não foi possível carregar os lançamentos."); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);
  return <details className="dashboard__historico">
    <summary>Histórico financeiro</summary>
    <p>Receitas e despesas de todo o histórico. Os indicadores de vendas acima seguem o período selecionado.</p>
    <ControleSegmentado rotulo="Tipo de lançamento" opcoes={[{ label: "Receitas", value: "receitas" }, { label: "Despesas", value: "despesas" }]} valor={tipo} onChange={setTipo} />
    {erro ? <p role="alert">{erro}</p> : <Tabela colunas={[{ chave: "data", titulo: "Data", render: i => new Date(i.data).toLocaleDateString("pt-BR") }, { chave: "descricao", titulo: "Descrição" }, { chave: "categoria", titulo: "Categoria", render: i => i.categoria || "Não informado" }, { chave: "valor", titulo: "Valor", render: i => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(i.valor) }]} linhas={dados[tipo]} carregando={carregando} vazio={tipo === "receitas" ? "Nenhuma receita registrada. As vendas finalizadas aparecerão aqui." : "Nenhuma despesa cadastrada."} caption={"Lançamentos de " + tipo} />}
  </details>;
}
