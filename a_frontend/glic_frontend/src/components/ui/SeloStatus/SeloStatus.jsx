import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import "./SeloStatus.css";
const icones = { alerta: AlertTriangle, erro: XCircle, sucesso: CheckCircle2 };
export default function SeloStatus({ variante = "sucesso", children, texto }) {
  const Icon = icones[variante] || CheckCircle2;
  return <span className={`ui-selo ui-selo--${variante}`}><Icon size={14} aria-hidden="true" />{texto || children}</span>;
}