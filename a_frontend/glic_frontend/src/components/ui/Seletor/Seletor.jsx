import { AlertCircle, ChevronDown, LoaderCircle } from "lucide-react";
import "./Seletor.css";
export default function Seletor({ id, label, valor, onChange, opcoes = [], erro, desabilitado = false, carregando = false, ...props }) {
  return <div className={`ui-seletor ${erro ? "ui-seletor--erro" : ""}`}>
    {label && <label htmlFor={id}>{label}</label>}
    <div className="ui-seletor__controle"><select {...props} id={id} value={valor ?? ""} onChange={onChange} disabled={desabilitado || carregando} aria-invalid={Boolean(erro)} aria-describedby={erro ? `${id}-erro` : undefined}><option value="">Selecionar</option>{opcoes.map((opcao) => <option key={opcao.value} value={opcao.value}>{opcao.label}</option>)}</select>{carregando ? <LoaderCircle size={16} aria-label="Carregando" /> : <ChevronDown size={16} aria-hidden="true" />}</div>
    {erro && <small id={`${id}-erro`} className="ui-seletor__erro"><AlertCircle size={14} aria-hidden="true" />{erro}</small>}
  </div>;
}