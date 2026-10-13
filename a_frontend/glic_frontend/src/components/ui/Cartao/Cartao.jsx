import "./Cartao.css";
export default function Cartao({ titulo, children, className = "", carregando = false, ...props }) {
  return <section {...props} className={`ui-cartao ${className}`.trim()}>{titulo && <h3 className="ui-cartao__titulo">{titulo}</h3>}{carregando ? <div className="ui-cartao__esqueleto" aria-label="Carregando" /> : children}</section>;
}