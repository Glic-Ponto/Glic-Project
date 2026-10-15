import { createContext, useContext, useMemo, useState } from "react";
import { autenticar, atualizarSenha as atualizarSenhaServico, atualizarUsuario, criarSessao, registrarUsuario } from "../services/authService";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  // Sessão mock em memória: ao reiniciar/recarregar o app, começa na tela de login.
  const [sessao, setSessao] = useState(null);

  function salvarSessao(novaSessao) {
    setSessao(novaSessao);
  }

  async function entrar(email, senha) {
    const usuario = await autenticar(email, senha);
    salvarSessao(criarSessao(usuario));
    return usuario;
  }

  async function trocarConta(email, senha) {
    return entrar(email, senha);
  }

  async function cadastrar(dados) {
    return registrarUsuario(dados);
  }

  async function atualizarPerfil(alteracoes) {
    if (!sessao?.usuario?.id) throw new Error("[texto a definir]");
    const usuario = await atualizarUsuario(sessao.usuario.id, alteracoes);
    salvarSessao({ ...sessao, usuario });
    return usuario;
  }

  async function alterarSenha(senhaAtual, senhaNova) {
    if (!sessao?.usuario?.id) throw new Error("[texto a definir]");
    return atualizarSenhaServico(sessao.usuario.id, senhaAtual, senhaNova);
  }

  function sair() {
    setSessao(null);
  }

  const value = useMemo(() => ({
    usuario: sessao?.usuario ?? null,
    token: sessao?.token ?? null,
    entrar,
    trocarConta,
    cadastrar,
    atualizarPerfil,
    alterarSenha,
    sair
  }), [sessao]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
