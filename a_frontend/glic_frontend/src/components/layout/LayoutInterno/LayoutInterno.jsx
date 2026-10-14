import { Outlet } from "react-router-dom";
import { useState } from "react";
import MenuLateral from "../MenuLateral/MenuLateral";
import Cabecalho from "../Cabecalho/Cabecalho";
import "./LayoutInterno.css";

export default function LayoutInterno() {
  const [acoesCabecalho, setAcoesCabecalho] = useState(null);
  return (
    <div className="layout-interno">
      <MenuLateral />
      <div className="layout-interno__principal">
        <Cabecalho acoesRef={setAcoesCabecalho} />
        <main id="conteudo-principal" className="layout-interno__conteudo"><Outlet context={{ acoesCabecalho }} /></main>
      </div>
    </div>
  );
}
