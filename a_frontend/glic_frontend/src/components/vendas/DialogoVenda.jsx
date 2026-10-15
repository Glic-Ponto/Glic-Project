import { useEffect, useRef } from "react";
import "./DialogoVenda.css";

export default function DialogoVenda({ titulo, onFechar, children, classe = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const anterior = document.activeElement;
    const dialogo = ref.current;
    dialogo.showModal();
    const manterFoco = (evento) => {
      if (evento.key !== "Tab") return;
      const focaveis = [...dialogo.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href]')];
      if (!focaveis.length) return;
      const primeiro = focaveis[0]; const ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo.focus(); }
      else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro.focus(); }
    };
    dialogo.addEventListener("keydown", manterFoco);
    dialogo.querySelector("button, input, select, textarea")?.focus();
    return () => { dialogo.removeEventListener("keydown", manterFoco); dialogo.close(); anterior?.focus(); };
  }, []);
  return <dialog ref={ref} className={`dialogo-venda ${classe}`} aria-labelledby="dialogo-venda-titulo" onCancel={e => { e.preventDefault(); onFechar(); }} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onFechar(); } }}>
    <h2 id="dialogo-venda-titulo">{titulo}</h2>
    <button className="dialogo-venda__fechar vendas__fechar" type="button" aria-label="Fechar diálogo" onClick={onFechar}>×</button>
    {children}
  </dialog>;
}
