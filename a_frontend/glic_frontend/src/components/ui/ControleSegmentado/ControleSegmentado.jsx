import "./ControleSegmentado.css";
export default function ControleSegmentado({ opcoes = [], valor, onChange, rotulo = "Período", desabilitado = false }) {
  return <div className="ui-segmentado" role="group" aria-label={rotulo}>{opcoes.map((opcao) => <button key={opcao.value} type="button" disabled={desabilitado} aria-pressed={valor === opcao.value} className={valor === opcao.value ? "ui-segmentado__opcao ui-segmentado__opcao--ativa" : "ui-segmentado__opcao"} onClick={() => onChange?.(opcao.value)}>{opcao.label}</button>)}</div>;
}