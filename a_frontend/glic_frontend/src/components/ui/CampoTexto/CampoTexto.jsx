import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import "./CampoTexto.css";

const CampoTexto = forwardRef(function CampoTexto({ id, label, tipo = "text", valor, onChange, placeholder, ajuda, erro, desabilitado = false, carregando = false, autoComplete, required = false, ...props }, ref) {
  const erroId = `${id}-erro`;
  const ajudaId = `${id}-ajuda`;
  return <div className={`ui-campo ${erro ? "ui-campo--erro" : ""}`}>
    {label && <label htmlFor={id}>{label}{required ? " *" : ""}</label>}
    <input {...props} ref={ref} id={id} type={tipo} value={valor ?? ""} onChange={onChange} placeholder={placeholder} disabled={desabilitado || carregando} autoComplete={autoComplete} required={required} aria-invalid={Boolean(erro)} aria-describedby={[erro ? erroId : "", ajuda ? ajudaId : ""].filter(Boolean).join(" ") || undefined} />
    {ajuda && <small id={ajudaId}>{ajuda}</small>}
    {erro && <small className="ui-campo__erro" id={erroId}><AlertCircle size={14} aria-hidden="true" />{erro}</small>}
  </div>;
});

export default CampoTexto;
