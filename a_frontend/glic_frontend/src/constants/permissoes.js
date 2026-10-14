export const perfis = { funcionario: "Funcionário", gestor: "Gestor" };

export const permissoes = {
  "/dashboard": [perfis.funcionario, perfis.gestor],
  "/nova-venda": [perfis.funcionario, perfis.gestor],
  "/vendas": [perfis.funcionario, perfis.gestor],
  "/estoque": [perfis.funcionario, perfis.gestor],
  "/usuarios": [perfis.gestor],
  "/perfil": [perfis.funcionario, perfis.gestor]
};
