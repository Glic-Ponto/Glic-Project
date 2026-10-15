import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const chave = (data) => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
const porChave = (valor) => { const [ano, mes, dia] = (valor || "").split("-").map(Number); return ano && mes && dia ? new Date(ano, mes - 1, dia) : null; };
const mesmoDia = (a, b) => a && b && chave(a) === chave(b);

export default function CalendarioPeriodo({ inicio, fim, aoSelecionar }) {
  const [inicial] = [porChave(inicio) || new Date()];
  const [mes, setMes] = useState(new Date(inicial.getFullYear(), inicial.getMonth(), 1));
  const inicioData = porChave(inicio); const fimData = porChave(fim);
  const primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const ultimo = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
  const dias = Array.from({ length: primeiro.getDay() }, () => null).concat(Array.from({ length: ultimo.getDate() }, (_, indice) => new Date(mes.getFullYear(), mes.getMonth(), indice + 1)));
  function escolher(data) {
    const valor = chave(data);
    if (!inicioData || fimData || data < inicioData) aoSelecionar({ inicio: valor, fim: "" });
    else aoSelecionar({ inicio, fim: valor });
  }
  return <div className="calendario-periodo" aria-label="Calendário para selecionar período">
    <div className="calendario-periodo__topo"><button type="button" aria-label="Mês anterior" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}><ChevronLeft size={16} /></button><strong>{mes.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</strong><button type="button" aria-label="Próximo mês" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}><ChevronRight size={16} /></button></div>
    <div className="calendario-periodo__semana" aria-hidden="true">{["D", "S", "T", "Q", "Q", "S", "S"].map((dia, indice) => <span key={`${dia}-${indice}`}>{dia}</span>)}</div>
    <div className="calendario-periodo__dias">{dias.map((data, indice) => data ? <button key={chave(data)} type="button" onClick={() => escolher(data)} aria-label={data.toLocaleDateString("pt-BR", { dateStyle: "full" })} aria-pressed={mesmoDia(data, inicioData) || mesmoDia(data, fimData)} className={`${mesmoDia(data, inicioData) || mesmoDia(data, fimData) ? "calendario-periodo__dia--selecionado" : ""} ${inicioData && fimData && data > inicioData && data < fimData ? "calendario-periodo__dia--intervalo" : ""}`}>{data.getDate()}</button> : <span key={`vazio-${indice}`} />)}</div>
  </div>;
}
