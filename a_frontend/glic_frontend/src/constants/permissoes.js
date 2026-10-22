export const perfis = { funcionario: "FUNCIONARIO", gerente: "GERENTE", admin: "ADMIN" };

export const permissoes = {
  "/dashboard": [perfis.funcionario, perfis.gerente, perfis.admin],
  "/nova-venda": [perfis.funcionario, perfis.gerente, perfis.admin],
  "/vendas": [perfis.funcionario, perfis.gerente, perfis.admin],
  "/estoque": [perfis.funcionario, perfis.gerente, perfis.admin],
  "/usuarios": [perfis.gerente, perfis.admin],
  "/perfil": [perfis.funcionario, perfis.gerente, perfis.admin]
};
