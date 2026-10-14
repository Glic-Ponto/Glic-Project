import { useState } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { textos } from "../../../constants/textos";
import MenuPerfil from "../MenuPerfil/MenuPerfil";
import MenuLateral from "../MenuLateral/MenuLateral";
import "./Cabecalho.css";

const titulos = {
  "/dashboard": textos.dashboard.titulo,
  "/nova-venda": textos.novaVenda.titulo,
  "/vendas": textos.vendas.titulo,
  "/estoque": textos.estoque.titulo,
  "/usuarios": textos.usuarios.titulo,
  "/perfil": textos.perfil.titulo
};

export default function Cabecalho({ acoesRef }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();
  const titulo = titulos[location.pathname] || textos.dashboard.titulo;
  return (
    <>
      <header className="cabecalho">
        <button className="cabecalho__menu" type="button" aria-label={textos.comuns.abrirMenu} aria-expanded={menuAberto} onClick={() => setMenuAberto(true)}><Menu aria-hidden="true" /></button>
        <h1 className="cabecalho__titulo" id="titulo-pagina">{titulo}</h1>
        <div className="cabecalho__acoes" ref={acoesRef} />
        <MenuPerfil />
      </header>
      {menuAberto && <><button className="cabecalho__fundo" aria-label={textos.comuns.fecharMenu} onClick={() => setMenuAberto(false)} /><MenuLateral aberto onNavegar={() => setMenuAberto(false)} /></>}
    </>
  );
}
