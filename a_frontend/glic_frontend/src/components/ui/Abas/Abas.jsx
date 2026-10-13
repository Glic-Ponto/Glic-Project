import "./Abas.css";
export default function Abas({ abas = [], ativa, onChange }) {
  return <div className="ui-abas" role="tablist" aria-label="Seções">{abas.map((aba) => <button key={aba.id} id={`aba-${aba.id}`} type="button" role="tab" aria-selected={ativa === aba.id} aria-controls={`painel-${aba.id}`} className={ativa === aba.id ? "ui-abas__item ui-abas__item--ativa" : "ui-abas__item"} onClick={() => onChange?.(aba.id)}>{aba.label}</button>)}</div>;
}