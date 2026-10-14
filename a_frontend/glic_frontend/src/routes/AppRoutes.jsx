import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { rotas } from "../constants/rotas";
import RotaPrivada from "./RotaPrivada";
import LayoutAutenticacao from "../components/layout/LayoutAutenticacao/LayoutAutenticacao";
import LayoutInterno from "../components/layout/LayoutInterno/LayoutInterno";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Perfil from "../pages/Perfil/Perfil";
import Dashboard from "../pages/Dashboard/Dashboard";
import Estoque from "../pages/Estoque/Estoque";
import NovaVenda from "../pages/NovaVenda/NovaVenda";
import Vendas from "../pages/Vendas/Vendas";
import Usuarios from "../pages/Usuarios/Usuarios";

function TelaPendente({ titulo }) {
  return <section className="pagina-pendente" aria-labelledby="titulo-pendente"><h1 id="titulo-pendente">{titulo}</h1><p>A tela será implementada na próxima rodada.</p></section>;
}

function Inicio() {
  const { usuario } = useAuth();
  return <Navigate to={usuario ? rotas.dashboard : rotas.login} replace />;
}

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Inicio />} />
    <Route element={<LayoutAutenticacao />}>
      <Route path={rotas.login} element={<Login />} />
      <Route path={rotas.cadastro} element={<Cadastro />} />
    </Route>
    <Route element={<RotaPrivada />}>
      <Route element={<LayoutInterno />}>
        <Route path={rotas.dashboard} element={<Dashboard />} />
        <Route path={rotas.novaVenda} element={<NovaVenda />} />
        <Route path={rotas.vendas} element={<Vendas />} />
        <Route path={rotas.estoque} element={<Estoque />} />
        <Route path={rotas.usuarios} element={<Usuarios />} />
        <Route path={rotas.perfil} element={<Perfil />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
