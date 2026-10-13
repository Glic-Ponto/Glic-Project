# Glic Frontend — Rodada 4

## Entrega
Implementadas as telas TL03 Nova Venda, TL04 Vendas, TL06 Financeiro e TL07 Usuários, integradas às telas TL02 Dashboard e TL05 Estoque das rodadas anteriores.

## Executar localmente
1. Instale Node.js compatível com Vite 6.
2. Na raiz do projeto, execute `npm install`.
3. Execute `npm run dev`.
4. Para validar a compilação de produção, execute `npm run build`.

## Dados de demonstração
A aplicação usa mocks em memória no navegador. Uma venda finalizada valida todos os itens, registra a venda, baixa o estoque, registra uma receita e pode ser consultada no histórico e nos resumos do Dashboard/Financeiro. Os dados são reiniciados quando a aplicação é recarregada; ainda não há persistência no backend.

## Contas mock
- Funcionário: `funcionario@glic.local` / `Glic123!`
- Gestor: `gestor@glic.local` / `Glic123!`

## Áreas por perfil
- Funcionário: Dashboard, Estoque, Vendas, Nova venda e Meu perfil.
- Gestor: Dashboard, Estoque, Vendas, Financeiro, Usuários e Meu perfil.
- Nova venda é exclusiva do perfil Funcionário; Financeiro e Usuários são exclusivos do Gestor.

## Árvore resumida
```text
src/
  components/        componentes reutilizáveis e layout
  constants/         rotas, permissões e textos
  contexts/          sessão/autenticação
  mocks/             usuários, produtos, vendas e financeiro
  pages/
    Cadastro/
    Dashboard/
    Estoque/
    Financeiro/
    Login/
    NovaVenda/
    Perfil/
    Usuarios/
    Vendas/
  routes/            rotas públicas e protegidas
  services/          serviços mock e regras de negócio
  styles/            tokens e estilos globais
```

## Decisões e limites conhecidos
- Persistência é somente em memória para vendas, estoque, receitas, despesas e usuários criados nesta sessão; recarregar a página reinicia os mocks.
- O cadastro administrativo cria usuários com perfil padrão Funcionário; a tela Usuários permite escolher Funcionário ou Gestor.
- Não existe fluxo de cadastro/edição de produtos nem cadastro de despesas nesta rodada.
- Desconto é valor monetário fixo, limitado ao subtotal. Não há integração com pagamento, emissão fiscal ou backend.
- Os totais financeiros são derivados dos lançamentos disponíveis no mock. Categorias de vendas dependem dos produtos e dos seus campos de categoria.
- A confirmação de venda ocorre antes da gravação. A baixa de estoque valida todos os itens antes de mutar os dados.
- Build não deve ser considerado validado enquanto `npm install` e `npm run build` não forem executados com dependências disponíveis.

## Checklist por tela
- [x] TL01 Login — implementado na rodada anterior
- [x] TL02 Dashboard — KPIs, filtro de período, gráficos e totais
- [x] TL03 Nova Venda — catálogo, carrinho, desconto, confirmação e atualização de estoque/financeiro
- [x] TL04 Vendas — busca, tabela e detalhe de venda
- [x] TL05 Estoque — KPIs, busca, filtros, paginação e detalhes
- [x] TL06 Financeiro — resumo e alternância entre receitas/despesas
- [x] TL07 Usuários — busca, cadastro, edição de perfil e ativação
- [x] TL08 Cadastro — implementado na rodada anterior
- [x] TL09 Meu Perfil — implementado na rodada anterior
- [ ] Validar fidelidade visual no navegador contra o Figma
- [ ] Executar build de produção após instalar dependências
