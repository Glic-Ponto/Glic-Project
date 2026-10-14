# Relatório de escala visual — Oficina DSom

Data: 14/10/2026.

A alteração se limita à apresentação do front-end. Back-end, serviços, autenticação, rotas, regras de negócio, dados mock, dependências e identificadores técnicos não foram modificados.

## Problemas e correções

- Cabeçalho desktop de 96 px e menu que aumentava para 240 px: cabeçalho de 64 px e menu de 212 px em todas as larguras desktop.
- Fontes e paddings excessivos nos controles: tokens compartilhados para densidade consistente em todas as nove telas.
- Conteúdo interno sem padding lateral consistente: padding centralizado no LayoutInterno; removido o padding duplicado do Perfil.
- Dashboard: mantidos os quatro indicadores, filtros, gráficos, ranking e totais. KPIs em uma, duas ou quatro colunas conforme a largura; espaço reservado para os ícones, valores de 26 px, gaps de 16 px e gráficos com área de 200/220 px.
- Login e Cadastro: removidos espaçamentos em vh e posicionamento absoluto do botão. Formulários com largura máxima de 480 px e ações no fluxo normal, permitindo crescimento quando há mensagens de validação.
- Perfil: removidas alturas mínimas de 25vh e 53vh; largura máxima de 960 px, campos em duas colunas quando há espaço e avatares menores.
- Estoque: filtros em duas colunas nas larguras intermediárias, eliminando a soma de larguras mínimas que excedia o painel.
- Nova Venda: catálogo e resumo empilhados até 1200 px; campos e valores podem quebrar linha.
- Tabelas, paginação, menus e modais: menor padding, quebra de linha quando necessária e limites de altura com rolagem. A rolagem horizontal interna das tabelas foi preservada.

## Dimensões e tokens

Valores em px equivalem a uma raiz de 16 px, sem alterar o tamanho da raiz ou o zoom.

| Token/elemento | Antes | Depois |
| --- | --- | --- |
| --texto-h1-tamanho | 28 px | 24 px; cabeçalho mobile 22 px |
| --texto-h2-tamanho | 22 px | 18 px |
| --texto-h3-tamanho | 18 px | 16 px |
| --texto-corpo-tamanho | 16 px | 14 px |
| --texto-botao-tamanho | 16 px | 14 px |
| --texto-kpi-tamanho | 32 px | 26 px |
| --altura-cabecalho | 96 px desktop | 64 px |
| --largura-menu | 200/240 px desktop; gaveta 280 px | 212 px desktop; gaveta 260 px limitada à viewport |
| --altura-controle (novo) | mínimo de 44 px mais paddings grandes | mínimo de 38 px desktop; 44 px mobile/toque |
| --espaco-controle-y (novo) | frequentemente 12 px | 6 px desktop; 8 px mobile |
| --espaco-conteudo-x (novo) | sem padrão entre páginas | 24 px tablet/desktop; 16 px mobile |
| --espaco-secao (novo) | 24 px nas grades de páginas | 16 px |
| --padding-card (novo) | 16 px | 16 px, centralizado para cartões compartilhados |
| Botão grande | mínimo de 52 px | mínimo de 40 px desktop / 44 px mobile/toque |
| Avatar pequeno/grande | 48/120 px | 36/80 px |
| Área do gráfico | 240 px | 200 px; principal do Dashboard 220 px |

Textos auxiliares de 12 px e tabelas/rótulos de 14 px foram preservados. O token --alvo-44 permanece em 44 px. Dispositivos com pointer: coarse mantêm controles com mínimo de 44 px independentemente da largura.

## Identidade

- Título da aba: Glic → Oficina DSom.
- Menu lateral: Glic → Oficina DSom.
- Painel de Login/Cadastro: placeholder IMG → Oficina DSom; a marca textual também fica visível no mobile.
- Nenhum logotipo oficial foi encontrado no repositório. A inserção do asset oficial está pendente; nenhuma marca foi criada ou gerada.
- Nomes técnicos, credenciais mock e a marca de produto Glic nos dados de estoque foram mantidos. Esses registros são dados de demonstração, não a identificação institucional da aplicação.

## Validação executada

- npm.cmd run build: aprovado com Vite 6.3.5, 2272 módulos transformados e sem erros ou avisos de CSS no build final.
- Aviso remanescente: bundle JavaScript de aproximadamente 629,71 kB minificado (181,15 kB gzip), acima do limite de aviso de 500 kB. Divisão de bundle não foi feita por estar fora do escopo visual.
- A primeira execução do Vite foi bloqueada pelo sandbox. O build foi concluído com execução autorizada fora dele.
- git diff --check: aprovado.
- Análise de 32 arquivos CSS com PostCSS: sintaxe válida e todas as referências a tokens definidas.
- Revisão estática das media queries nas larguras solicitadas:

| Largura | Menu | Cabeçalho | Controle mínimo, ponteiro fino | Padding lateral |
| --- | --- | --- | --- | --- |
| 375 px | Gaveta | 64 px | 44 px | 16 px |
| 768 px | Gaveta | 64 px | 38 px | 24 px |
| 1024 px | 212 px | 64 px | 38 px | 24 px |
| 1366 px | 212 px | 64 px | 38 px | 24 px |
| 1440 px | 212 px | 64 px | 38 px | 24 px |
| 1920 px | 212 px | 64 px | 38 px | 24 px |

- As nove telas continuam registradas em AppRoutes.jsx: Login, Cadastro, Dashboard, Estoque, Nova Venda, Vendas, Financeiro, Usuários e Perfil. Os arquivos de rotas não têm alterações e todos os componentes foram incluídos no build.
- O servidor Vite iniciou corretamente. A ferramenta de navegador retornou que o navegador integrado não está disponível, com inventário vazio de navegadores e aplicativos.
- Limitação: não foram realizados testes visuais renderizados nas seis resoluções nem testes funcionais por interação. A revisão estática e o build não comprovam ausência de transbordamentos reais ou regressões em execução. Essa validação manual permanece pendente.

## Arquivos modificados

Caminhos relativos a a_frontend/glic_frontend:
- index.html
- src/components/layout/Cabecalho/Cabecalho.css
- src/components/layout/LayoutAutenticacao/LayoutAutenticacao.css
- src/components/layout/LayoutAutenticacao/LayoutAutenticacao.jsx
- src/components/layout/LayoutInterno/LayoutInterno.css
- src/components/layout/MenuLateral/MenuLateral.css
- src/components/layout/MenuLateral/MenuLateral.jsx
- src/components/layout/MenuPerfil/MenuPerfil.css
- src/components/ui/Abas/Abas.css
- src/components/ui/Avatar/Avatar.css
- src/components/ui/Botao/Botao.css
- src/components/ui/CampoTexto/CampoTexto.css
- src/components/ui/Cartao/Cartao.css
- src/components/ui/CartaoKpi/CartaoKpi.css
- src/components/ui/ControleSegmentado/ControleSegmentado.css
- src/components/ui/EstadoVazio/EstadoVazio.css
- src/components/ui/Graficos/Graficos.css
- src/components/ui/OpcaoCartao/OpcaoCartao.css
- src/components/ui/Paginacao/Paginacao.css
- src/components/ui/Seletor/Seletor.css
- src/components/ui/Tabela/Tabela.css
- src/pages/Cadastro/Cadastro.css
- src/pages/Dashboard/Dashboard.css
- src/pages/Estoque/Estoque.css
- src/pages/Financeiro/Financeiro.css
- src/pages/Login/Login.css
- src/pages/NovaVenda/NovaVenda.css
- src/pages/Perfil/Perfil.css
- src/pages/Usuarios/Usuarios.css
- src/pages/Vendas/Vendas.css
- src/styles/global.css
- src/styles/tokens.css
- RELATORIO_VISUAL.md (este relatório)
