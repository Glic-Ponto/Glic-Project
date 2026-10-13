import { Outlet } from "react-router-dom";
import "./LayoutAutenticacao.css";

export default function LayoutAutenticacao() {
  return <main className="layout-autenticacao">
    <aside className="layout-autenticacao__imagem" aria-hidden="true"><span>IMG</span></aside>
    <section className="layout-autenticacao__conteudo"><Outlet /></section>
  </main>;
}
