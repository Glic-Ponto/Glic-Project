import { Outlet } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral";
import Cabecalho from "../Cabecalho/Cabecalho";
import "./LayoutInterno.css";

export default function LayoutInterno() {
  return (
    <div className="layout-interno">
      <MenuLateral />
      <div className="layout-interno__principal">
        <Cabecalho />
        <main id="conteudo-principal" className="layout-interno__conteudo"><Outlet /></main>
      </div>
    </div>
  );
}
