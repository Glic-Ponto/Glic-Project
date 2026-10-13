import { useEffect, useRef, useState } from "react";
import { ChevronDown, UserRound, KeyRound, ArrowLeftRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { rotas } from "../../../constants/rotas";
import { textos } from "../../../constants/textos";
import Avatar from "../../ui/Avatar/Avatar";
import "./MenuPerfil.css";

export default function MenuPerfil() {
  const { usuario, sair } = useAuth();
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function fechar(evento) {
      if (evento.key === "Escape") setAberto(false);
      if (evento.type === "pointerdown" && ref.current && !ref.current.contains(evento.target)) setAberto(false);
    }
    document.addEventListener("keydown", fechar);
    document.addEventListener("pointerdown", fechar);
    return () => {
      document.removeEventListener("keydown", fechar);
      document.removeEventListener("pointerdown", fechar);
    };
  }, []);

  function trocarConta() {
    sair();
    setAberto(false);
    navigate(rotas.login);
  }

  function irParaSeguranca() {
    setAberto(false);
    navigate(`${rotas.perfil}#seguranca`);
  }

  return (
    <div className="menu-perfil" ref={ref}>
      <button className="menu-perfil__gatilho" type="button" aria-expanded={aberto} aria-haspopup="menu" onClick={() => setAberto((valor) => !valor)}>
        <UserRound size={18} aria-hidden="true" /><span>{textos.comuns.perfil}</span><ChevronDown size={16} aria-hidden="true" />
      </button>
      {aberto && <div className="menu-perfil__painel" role="menu">
        <div className="menu-perfil__usuario"><Avatar nome={usuario?.nome || ""} src={usuario?.foto} tamanho="pequeno" /><div><strong>{usuario?.nome || ""}</strong><span>{usuario?.perfil || ""}</span></div></div>
        <Link role="menuitem" to={rotas.perfil} onClick={() => setAberto(false)}><UserRound size={18} aria-hidden="true" />{textos.comuns.perfil}</Link>
        <button role="menuitem" type="button" onClick={trocarConta}><ArrowLeftRight size={18} aria-hidden="true" />{textos.comuns.trocarConta}</button>
        <button role="menuitem" type="button" onClick={irParaSeguranca}><KeyRound size={18} aria-hidden="true" />{textos.comuns.trocarSenha}</button>
      </div>}
    </div>
  );
}
