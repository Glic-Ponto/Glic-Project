import { ChevronLeft, ChevronRight } from "lucide-react";
import Botao from "../Botao/Botao";
import "./Paginacao.css";
export default function Paginacao({ pagina = 1, totalPaginas = 1, onChange }) {
  return <nav className="ui-paginacao" aria-label="Paginação"><Botao variante="terciario" desabilitado={pagina <= 1} aria-label="Página anterior" onClick={() => onChange?.(pagina - 1)}><ChevronLeft size={18} /></Botao><span>Página {pagina} de {totalPaginas}</span><Botao variante="terciario" desabilitado={pagina >= totalPaginas} aria-label="Próxima página" onClick={() => onChange?.(pagina + 1)}><ChevronRight size={18} /></Botao></nav>;
}