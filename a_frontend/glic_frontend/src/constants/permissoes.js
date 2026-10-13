export const perfis = { funcionario: "Funcionário", gestor: "Gestor" };

export const permissoes = {
  "/dashboard": [perfis.funcionario, perfis.gestor],
  "/nova-venda": [perfis.funcionario],
  "/vendas": [perfis.funcionario, perfis.gestor],
  "/estoque": [perfis.funcionario, perfis.gestor],
  "/financeiro": [perfis.gestor],
  "/usuarios": [perfis.gestor],
  "/perfil": [perfis.funcionario, perfis.gestor]
};
