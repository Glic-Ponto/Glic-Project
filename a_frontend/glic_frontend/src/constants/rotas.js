export const rotas = {
  login: "/login",
  cadastro: "/cadastro",
  dashboard: "/dashboard",
  novaVenda: "/nova-venda",
  vendas: "/vendas",
  comprovanteVenda: id => `/vendas/${encodeURIComponent(id)}/comprovante`,
  estoque: "/estoque",
  usuarios: "/usuarios",
  perfil: "/perfil"
};
