# Relatório — Vendas, Nova Venda e consolidação financeira

Data: 14/10/2026.

## Escopo entregue

- A tela **Nova venda** foi reorganizada em dois painéis escuros, próximos da proporção 65/35 do TL03. O painel esquerdo reúne serviço, tipo de veículo, área de aplicação e produtos do estoque. O painel direito reúne itens, quantidades, remoção, desconto, totais e ações.
- Serviço, tipo de veículo e área usam seleções React com borda vermelha. Cada produto guarda uma cópia da configuração ativa ao ser adicionado, permitindo itens com configurações diferentes na mesma venda.
- Nenhum preço foi criado para serviço, veículo ou área. O preço utilizado é exclusivamente o preço do produto no catálogo de estoque existente.
- **Ver orçamento** mostra o resumo corrente. **Limpar** exige confirmação quando há dados e não altera estoque ou financeiro.
- **Salvar** cria ou atualiza um rascunho. O rascunho aparece em Vendas e pode ser retomado pelo funcionário que o criou. Ele não reduz estoque, não gera receita e não participa dos indicadores do Dashboard.
- **Finalizar venda** exige confirmação, revalida os dados no serviço, efetua uma única baixa agregada por produto e registra uma única receita. A confirmação final exibe identificador, total, saldos atuais e links para Estoque, Dashboard e Vendas.
- A tela **Vendas** agora apresenta cliente, veículo, data, valor, pagamento e status, além dos detalhes. A busca cobre cliente, veículo, identificador e responsável; o filtro de status só aparece quando há registros.
- Cliente, veículo e pagamento permanecem como **Não informado**. O projeto não contém campos ou uma especificação inequívoca para coletá-los no TL03, portanto não foi criado um formulário comercial novo.
- A página e a rota independente **Financeiro** foram removidas. Receitas, despesas, resultado, faturamento, vendas, ticket médio, descontos e gráficos permanecem no Dashboard. O histórico de receitas e despesas foi incorporado ao Dashboard para o perfil Gestor.
- Funcionário e Gestor podem criar, salvar, retomar e finalizar as próprias vendas. O histórico financeiro incorporado ao Dashboard continua restrito ao Gestor.

## Integridade do fluxo mock

- Quantidade deve ser inteira, positiva e não pode exceder o estoque agregado do produto.
- Preço deve ser finito, não negativo e coincidir com o catálogo atual.
- Desconto deve ser finito, não negativo e não pode superar o subtotal; o total nunca pode ser negativo.
- A chave da operação impede que cliques ou chamadas concorrentes finalizem a mesma venda mais de uma vez.
- Se qualquer etapa do commit falhar, quantidades, movimentações e receitas retornam ao estado anterior.
- Registros antigos sem `status` continuam sendo interpretados como vendas finalizadas. Campos complementares ausentes continuam ausentes no dado e são exibidos de forma neutra na interface.

## Validação executada

- `npm.cmd run build`: aprovado com Vite 6.3.5 e 2.275 módulos transformados.
- Testes dos serviços reais carregados pelo Vite: **32 cenários aprovados**, cobrindo rascunhos, retomada, cópias defensivas, finalização concorrente, idempotência, estoque, receita, Dashboard, rollback, dados inválidos, estoque agregado, permissões e compatibilidade com registros antigos.
- Chrome headless com perfil temporário: **78 verificações de viewport**, **13 grupos de interação** e nenhuma exceção JavaScript.
- Resoluções verificadas: 375 × 812, 768 × 1024, 1024 × 768, 1366 × 768, 1440 × 900 e 1920 × 1080.
- Fluxo verificado no navegador: orçamento, limpeza confirmada, seleção de configuração e produtos, quantidade, desconto, salvar rascunho, confirmar ausência de baixa, listar, retomar, finalizar, conferir estoque, histórico, acesso do Gestor à Nova venda, Dashboard e redirecionamento de `/financeiro` para `/dashboard`.
- Login, Cadastro, Estoque, Perfil e Usuários também foram percorridos na matriz responsiva.
- `git diff --check`: aprovado.

O aviso de bundle acima de 500 kB permanece: aproximadamente 638,58 kB minificado e 184,41 kB gzip. A divisão do bundle está fora deste escopo e não impede o build.

## Arquivos desta etapa

Criados:

- `src/components/vendas/DialogoVenda.jsx`
- `src/components/vendas/DialogoVenda.css`
- `src/constants/vendas.js`
- `src/pages/Dashboard/HistoricoFinanceiro.jsx`
- `validation/vendas.mjs`
- `RELATORIO_VENDAS.md`

Modificados:

- `src/pages/NovaVenda/NovaVenda.jsx`
- `src/pages/NovaVenda/NovaVenda.css`
- `src/pages/Vendas/Vendas.jsx`
- `src/pages/Vendas/Vendas.css`
- `src/pages/Dashboard/Dashboard.jsx`
- `src/pages/Dashboard/Dashboard.css`
- `src/services/vendasService.js`
- `src/services/estoqueService.js`
- `src/services/financeiroService.js`
- `src/services/dashboardService.js`
- `src/routes/AppRoutes.jsx`
- `src/constants/rotas.js`
- `src/constants/permissoes.js`
- `src/constants/textos.js`
- `src/components/layout/Cabecalho/Cabecalho.jsx`
- `validation/visual.cjs`
- `dist/index.html` e assets gerados pelo build

Removidos:

- `src/pages/Financeiro/Financeiro.jsx`
- `src/pages/Financeiro/Financeiro.css`

## Limitações e divergências conhecidas

- Todo o estado continua em memória; recarregar a aplicação apaga vendas, rascunhos, movimentações e receitas criados na sessão. Isso será resolvido somente com o back-end futuro.
- Cliente, identificação real do veículo e forma de pagamento dependem de especificação de produto. Novas vendas são gravadas com esses campos nulos e exibidas como “Não informado”.
- Tipo A/B e Área A/B/C continuam identificados como valores demonstrativos do protótipo e não alteram preço.
- O catálogo não possui imagens de produto. Foram usados ícones Lucide já instalados, sem criar um segundo catálogo ou assets fictícios.
- Os nomes dos produtos seguem o estoque mock existente, mesmo quando diferem dos exemplos gráficos das capturas.
