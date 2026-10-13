import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { rotas } from "../constants/rotas";
import { permissoes } from "../constants/permissoes";

export default function RotaPrivada() {
  const { usuario } = useAuth();
  const location = useLocation();
  if (!usuario) return <Navigate to={rotas.login} state={{ from: location }} replace />;
  const perfisPermitidos = permissoes[location.pathname];
  if (perfisPermitidos && !perfisPermitidos.includes(usuario.perfil)) {
    return <Navigate to={rotas.dashboard} replace />;
  }
  return <Outlet />;
}
