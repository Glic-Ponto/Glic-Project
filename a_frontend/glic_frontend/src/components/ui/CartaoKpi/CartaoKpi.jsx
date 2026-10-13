import { TrendingDown, TrendingUp } from "lucide-react";
import "./CartaoKpi.css";
export default function CartaoKpi({ titulo, valor, variacao, tendencia, carregando = false }) {
  return <article className="ui-kpi" aria-busy={carregando || undefined}><span className="ui-kpi__titulo">{titulo}</span>{carregando ? <div className="ui-kpi__esqueleto" /> : <><strong>{valor}</strong>{variacao != null && <span className="ui-kpi__variacao">{tendencia === "queda" ? <TrendingDown size={16} /> : <TrendingUp size={16} />}{variacao}</span>}</>}</article>;
}