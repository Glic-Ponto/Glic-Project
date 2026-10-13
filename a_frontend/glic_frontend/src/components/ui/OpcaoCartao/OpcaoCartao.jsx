import "./OpcaoCartao.css";
export default function OpcaoCartao({ titulo, descricao, selecionado = false, desabilitado = false, onClick, ...props }) {
  return <button {...props} type="button" className={`ui-opcao-cartao ${selecionado ? "ui-opcao-cartao--selecionado" : ""}`} aria-pressed={selecionado} disabled={desabilitado} onClick={onClick}><strong>{titulo}</strong>{descricao && <span>{descricao}</span>}</button>;
}