import { LoaderCircle } from "lucide-react";
import "./Botao.css";
export default function Botao({ children, variante = "primario", tamanho = "medio", desabilitado = false, carregando = false, erro = false, tipo = "button", bloco = false, onClick, ...props }) {
  return <button {...props} type={tipo} onClick={onClick} disabled={desabilitado || carregando} aria-busy={carregando || undefined} className={`ui-botao ${bloco ? "ui-botao--bloco" : ""} ui-botao--${variante} ui-botao--${tamanho}${erro ? " ui-botao--erro" : ""} ${props.className || ""}`.trim()}>{carregando ? <LoaderCircle className="ui-botao__loader" aria-label="Carregando" /> : children}</button>;
}