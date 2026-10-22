import { usuariosMock } from "../mocks/usuarios";
import { atrasoMock } from "./api";

export async function listarUsuarios() {
  await atrasoMock();
  return usuariosMock.map(({ senha: _senha, ...usuario }) => usuario);
}
export async function cadastrarUsuario(dados) {
  await atrasoMock();
  if (usuariosMock.some((usuario) => usuario.email.toLowerCase() === dados.email.toLowerCase())) {
    throw new Error("Já existe um usuário com este e-mail.");
  }
  const usuario = { id: `u-${Date.now()}`, perfil: "FUNCIONARIO", ativo: true, criadoEm: new Date().toISOString(), ...dados };
  usuariosMock.push(usuario);
  const { senha: _senha, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
}
export async function atualizarUsuario(id, alteracoes) {
  await atrasoMock();
  const usuario = usuariosMock.find((item) => item.id === id);
  if (!usuario) throw new Error("Usuário não encontrado.");
  if (alteracoes.email && usuariosMock.some((item) => item.id !== id && item.email.toLowerCase() === alteracoes.email.toLowerCase())) {
    throw new Error("Já existe um usuário com este e-mail.");
  }
  Object.assign(usuario, alteracoes);
  const { senha: _senha, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
}
