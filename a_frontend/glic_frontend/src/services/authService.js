import { usuariosMock } from "../mocks/usuarios";
import { atrasoMock } from "./api";

function usuarioSeguro(usuario) {
  const { senha: _senha, ...dados } = usuario;
  return dados;
}

export async function autenticar(email, senha) {
  await atrasoMock();
  const usuario = usuariosMock.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.senha === senha);
  if (!usuario) throw new Error("E-mail ou senha incorretos. Confira os dados e tente novamente.");
  if (usuario.ativo === false) throw new Error("Esta conta está inativa e não pode ser acessada.");
  return usuarioSeguro(usuario);
}

export async function registrarUsuario({ nome, email, senha }) {
  await atrasoMock();
  if (usuariosMock.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error("[texto a definir]");
  }
  const usuario = {
    id: `u-${Date.now()}`,
    nome: nome.trim(),
    email: email.trim(),
    senha,
    perfil: "Funcionário",
    foto: ""
  };
  usuariosMock.push(usuario);
  return usuarioSeguro(usuario);
}

export async function atualizarUsuario(id, alteracoes) {
  await atrasoMock();
  const usuario = usuariosMock.find((item) => item.id === id);
  if (!usuario) throw new Error("[texto a definir]");
  if (alteracoes.email && usuariosMock.some((item) => item.id !== id && item.email.toLowerCase() === alteracoes.email.trim().toLowerCase())) {
    throw new Error("[texto a definir]");
  }
  Object.assign(usuario, alteracoes);
  return usuarioSeguro(usuario);
}

export async function atualizarSenha(id, senhaAtual, senhaNova) {
  await atrasoMock();
  const usuario = usuariosMock.find((item) => item.id === id);
  if (!usuario || usuario.senha !== senhaAtual) throw new Error("A senha atual está incorreta.");
  usuario.senha = senhaNova;
  return true;
}

export function criarSessao(usuario) {
  return { usuario, token: `mock-${usuario.id}-${Date.now()}` };
}
