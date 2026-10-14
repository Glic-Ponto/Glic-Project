import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";

// Mantém o estado e os eventos na página; apenas apresenta suas ações no cabeçalho.
export default function AcoesCabecalho({ children }) {
  const { acoesCabecalho } = useOutletContext();
  return acoesCabecalho ? createPortal(children, acoesCabecalho) : null;
}
