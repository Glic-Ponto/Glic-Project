import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Receipt, LogOut } from "lucide-react";
import { rotas } from "../../../constants/rotas";
import { textos } from "../../../constants/textos";
import { useAuth } from "../../../contexts/AuthContext";
import "./MenuLateral.css";

const itens = [
  { to: rotas.dashboard, label: textos.comuns.dashboard, Icon: LayoutDashboard },
  { to: rotas.estoque, label: textos.comuns.estoque, Icon: Package },
  { to: rotas.vendas, label: textos.comuns.vendas, Icon: Receipt }
];

export default function MenuLateral({ aberto = false, onNavegar }) {
  const { sair } = useAuth();
  const navigate = useNavigate();
  function encerrarSessao() {
    sair();
    onNavegar?.();
    navigate(rotas.login);
  }
  return (
    <nav className={`menu-lateral ${aberto ? "menu-lateral--aberto" : ""}`} aria-label="Menu principal">
      <div className="menu-lateral__marca"><img src="/assets/logo-oficina-dsom.png" alt="Oficina DSom" /></div>
      <div className="menu-lateral__links">
        {itens.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} onClick={onNavegar} className={({ isActive }) => `menu-lateral__item${isActive ? " menu-lateral__item--ativo" : ""}`}>
            <Icon aria-hidden="true" size={20} /><span>{label}</span>
          </NavLink>
        ))}
      </div>
      <button className="menu-lateral__sair" type="button" onClick={encerrarSessao}><LogOut aria-hidden="true" size={18} />{textos.comuns.sair}</button>
    </nav>
  );
}
