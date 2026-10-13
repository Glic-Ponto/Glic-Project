import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import "./Alerta.css";
const icones = { sucesso: CheckCircle2, alerta: AlertTriangle, erro: AlertCircle };
export default function Alerta({ variante = "alerta", children, titulo, className = "" }) {
  const Icon = icones[variante] || AlertTriangle;
  return <div className={`ui-alerta ui-alerta--${variante} ${className}`.trim()} role={variante === "erro" ? "alert" : "status"} aria-live={variante === "erro" ? "assertive" : "polite"}><Icon aria-hidden="true" size={20} /><div>{titulo && <strong>{titulo}</strong>}<div>{children}</div></div></div>;
}