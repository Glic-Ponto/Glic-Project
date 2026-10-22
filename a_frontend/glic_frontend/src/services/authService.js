import { requisicao } from "./api";

export async function autenticar(email, senha) {
  try {
    return await requisicao("/usuarios/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), senha })
    });
  } catch (erro) {
    if (erro.status === 401) throw new Error("E-mail ou senha incorretos. Confira os dados e tente novamente.");
    if (erro.status === 403) throw new Error("Esta conta está inativa e não pode ser acessada.");
    throw erro;
  }
}

export async function registrarUsuario({ nome, email, senha }) {
  try {
    return await requisicao("/usuarios/cadastro", {
      method: "POST",
      body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha })
    });
  } catch (erro) {
    if (erro.status === 409) throw new Error("Já existe um usuário com este e-mail.");
    throw erro;
  }
}

export async function atualizarUsuario(id, alteracoes) {
  try {
    return await requisicao(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(alteracoes)
    });
  } catch (erro) {
    if (erro.status === 404) throw new Error("Usuário não encontrado.");
    if (erro.status === 409) throw new Error("Já existe um usuário com este e-mail.");
    throw erro;
  }
}

export async function atualizarSenha(id, senhaAtual, senhaNova) {
  try {
    await requisicao(`/usuarios/${id}/senha`, {
      method: "PUT",
      body: JSON.stringify({ senhaAtual, senhaNova })
    });
    return true;
  } catch (erro) {
    if (erro.status === 401) throw new Error("A senha atual está incorreta.");
    if (erro.status === 404) throw new Error("Usuário não encontrado.");
    throw erro;
  }
}

export function criarSessao(usuario) {
  return { usuario, token: `mock-${usuario.id}-${Date.now()}` };
}
