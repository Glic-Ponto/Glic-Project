import { Outlet, useLocation } from "react-router-dom";
import { rotas } from "../../../constants/rotas";
import "./LayoutAutenticacao.css";

export default function LayoutAutenticacao() {
  const { pathname } = useLocation();
  const imagem = pathname === rotas.cadastro ? "/assets/oficina-cadastro.png" : "/assets/oficina-login.png";
  return <main className="layout-autenticacao">
    <aside className="layout-autenticacao__imagem"><img src={imagem} alt="" /></aside>
    <section className="layout-autenticacao__conteudo"><Outlet /></section>
  </main>;
}
