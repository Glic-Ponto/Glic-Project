# Readequação visual aos protótipos — Oficina DSom

Data: 14/10/2026. Este relatório substitui o da primeira rodada de escala visual.

## Resultado e escopo

A composição foi aproximada das referências TL02–TL09 fornecidas, com menu estreito, cabeçalho compacto, painéis escuros onde aparecem nos protótipos, tabelas densas e formulários proporcionais. Foram preservados serviços, mocks, autenticação, permissões, rotas, contratos e dependências declaradas.

A fidelidade é à organização e à hierarquia visual: os protótipos não foram ampliados como imagens, nem usados zoom ou transform: scale(). Molduras externas, títulos de demonstração e linhas azuis de seleção das capturas não fazem parte da interface.

## Correções por tela e componente

| Área | Correções |
| --- | --- |
| Layout compartilhado | Menu desktop de 160 px, ícones de 15 px, texto de 13 px e itens de 32 px; saída junto à base da viewport; gaveta preservada. Cabeçalho de 56 px e conteúdo com largura máxima para evitar expansão excessiva em 1920 px. |
| TL02 — Dashboard | Filtro de período no cabeçalho; quatro KPIs na mesma linha a partir de 1024 px; gráfico principal mais baixo; barras horizontais escuras com valores; ranking numerado; totais em três células claras com divisórias. Tooltips, tabelas equivalentes, indicadores e filtros mantidos. |
| TL03 — Nova Venda | Catálogo e itens da venda em dois painéis escuros na proporção aproximada de 65%/35%; cartões claros em grade; totais e finalização no rodapé do resumo. Atualizar produtos no cabeçalho. Mantidos busca, disponibilidade, quantidades, remoção, desconto, confirmação e mensagens. |
| TL04 — Vendas | Removido título duplicado; contagem em linha, ação Nova venda preservada; busca na largura útil; tabela escura no cabeçalho e linhas compactas; modal de detalhes dimensionado para mobile. |
| TL05 — Estoque | KPIs em uma linha no desktop; rótulos dos filtros visíveis; filtros em uma linha a partir de 1366 px e duas colunas nas larguras intermediárias. Lista e detalhes em proporção aproximada de 65%/35%. Seleção com borda vermelha, preço/status à direita, Novo produto acima do painel escuro, detalhes claros e ações abaixo. Contraste dos status corrigido no painel escuro. Novo/Editar continuam desabilitados. |
| TL07 — Usuários | Título somente no cabeçalho; Cadastrar usuário alinhado à direita; busca, contagem, tabela, status discretos e ação Editar mantidos. Modais existentes preservados. |
| TL08 — Cadastro | Painéis 32%/68%; marca textual na parte superior do painel neutro escuro; formulário mais largo, título superior, campos empilhados e botão centralizado. Ações continuam no fluxo normal, sem posicionamento absoluto. |
| TL09 — Perfil | Cartão horizontal com avatar de 64 px, identificação e ações de imagem à direita; formulário escuro com campos em uma coluna, separação de segurança e Salvar à direita. Menu de perfil escuro e compacto. |
| Login / Financeiro | Login acompanha o layout de autenticação; Financeiro recebe os tokens e estilos compartilhados. Os controles existentes foram mantidos. |

Alterações de markup foram restritas à apresentação: área de ações no cabeçalho via portal React, remoção de títulos duplicados, rótulos visíveis, agrupamento do painel de estoque e orientação do gráfico de categorias. Os eventos e cálculos continuam nas páginas originais. As variantes visuais inválidas secundaria/primaria foram corrigidas para secundario/primario nos botões afetados.

## Dimensões principais

| Elemento/token | Valor final |
| --- | --- |
| --largura-menu | 160 px desktop; gaveta de até 248 px |
| --altura-cabecalho | 56 px desktop; cresce no mobile para acomodar ações |
| --altura-controle | 32 px em ponteiro fino a partir de 768 px; 44 px em mobile ou pointer: coarse |
| --texto-h1-tamanho | 20 px |
| --texto-h2-tamanho / --texto-h3-tamanho | 16 / 14 px |
| Corpo / tabelas / botões / rótulos | 14 / 13 / 13 / 12 px |
| --texto-kpi-tamanho | 24 px |
| --espaco-secao / --padding-card | 12 / 12 px |
| Padding horizontal do conteúdo | 20 px desktop/tablet; 16 px mobile |
| Área útil máxima | Layout 1280 px; Dashboard 1080 px; Nova Venda 1120 px; Estoque 1200 px; Perfil 920 px |
| Área do gráfico principal / categorias | 112 / 160 px, além de título e consulta de dados |
| Cadastro/Login | Coluna de formulário até 760 px, incluindo padding; botão de 176 px, limitado ao espaço disponível |
| Bordas / raios | #C4C4C4; raios de 3 e 4 px; cartões sem sombra |

A largura do menu foi estimada pela faixa lateral das referências, próxima de um sexto da composição menor, e pelo espaço necessário aos rótulos reais. Foi fixada em 160 px para manter essa densidade sem crescer proporcionalmente à viewport. A raiz continua em 16 px; as fontes não foram reduzidas por zoom.

## Diferenças visuais e divergências funcionais preservadas

- Assets: não há logotipo oficial isolado, foto original da oficina ou fotos de produtos no repositório. Permanecem Oficina DSom em texto, painel de autenticação neutro e ícones existentes para produtos. As capturas de referência não foram recortadas para fabricar assets.
- Nova Venda: não existem seleção de serviço, veículo ou área de aplicação; orçamento, salvar rascunho e limpeza global do carrinho também não existem como nos protótipos. Não foram criados. A confirmação atual é um diálogo, seguido de mensagem de sucesso; o carrinho é limpo pela regra existente.
- Vendas: os dados atuais usam identificador, data, responsável e total. Cliente, veículo, pagamento e status da referência não foram inventados. A pesquisa continua por número/responsável.
- Estoque: formulários e operações de Novo/Editar produto estão pendentes. Os botões permanecem desabilitados. Sem seleção, o painel mostra a orientação existente; não foram adicionadas abas ou ações sem produto.
- Cadastro: seleção de função e código de autorização administrativa continuam ausentes. Não houve alteração de permissões.
- Usuários: busca, contagem e coluna Editar, já existentes, continuam disponíveis embora não apareçam na referência.
- Dashboard: mantida a consulta acessível dos gráficos em tabela, que acrescenta altura em relação ao protótipo. Os valores e curvas são os dados mock atuais, não os valores das imagens.
- O filtro Personalizado continua com o comportamento mock existente (30 dias), sem novo seletor de intervalo.
- Cadastro, Perfil e mensagens mantêm validações e textos existentes, inclusive os placeholders de texto anteriores.

## Validação executada

**Build final:** npm.cmd run build aprovado com Vite 6.3.5; 2273 módulos transformados; sem erros de compilação ou avisos de CSS. Bundle JavaScript de 628,47 kB (180,99 kB gzip). Permanece o aviso de chunk acima de 500 kB; divisão de bundle não foi incluída no escopo visual.

As dependências estavam ausentes neste checkout e foram restauradas com npm ci --ignore-scripts a partir do lockfile existente. package.json e package-lock.json permaneceram inalterados. Os arquivos dist, já versionados, foram regenerados pelo build.

**Navegador:** Chrome headless instalado, em perfil temporário isolado, usando Node/CDP sem novas dependências. A execução final passou em **78 verificações de viewport**, com **78 capturas PNG**, **10 grupos de interações** e **zero exceções JavaScript capturadas**.

| Resolução | Verificação |
| --- | --- |
| 375 × 812 | Páginas e estados testados sem overflow horizontal da página; layout empilhado |
| 768 × 1024 | Páginas e estados testados sem overflow horizontal da página; gaveta preservada |
| 1024 × 768 | Menu desktop; quatro KPIs no Dashboard; painéis de venda/estoque em duas colunas |
| 1366 × 768 | Dashboard, tabelas e painéis comparados visualmente às referências |
| 1440 × 900 | Grades e limites de largura verificados |
| 1920 × 1080 | Conteúdo limitado em largura, sem expansão desnecessária dos cartões |

As nove rotas foram renderizadas nas seis resoluções com os perfis adequados: Login, Cadastro, Dashboard, Estoque, Nova Venda, Vendas, Perfil, Usuários e Financeiro. Foram verificados também estados adicionais de venda/estoque, menu, diálogos e validação de cadastro.

Interações efetivamente exercitadas:

- Login dos dois perfis mock e validação de campos obrigatórios do Cadastro.
- Mudança de período do Dashboard e abertura dos dados do gráfico em tabela.
- Seleção, pesquisa e abas de Estoque; confirmação de Novo/Editar desabilitados.
- Inclusão de produtos, alteração de quantidade, desconto, confirmação e finalização de uma venda mock.
- Listagem e abertura/fechamento dos detalhes da venda.
- Menu de perfil, fechamento por Escape e abertura/fechamento da gaveta mobile.
- Pesquisa de usuários e abertura/fechamento dos modais existentes de criação/edição.
- Alternância entre receitas e despesas no Financeiro.

git diff --check passou. A comparação do diff confirmou ausência de alterações em back-end, serviços, mocks, contextos de autenticação, constantes de permissões, rotas e manifestos de dependências.

## Evidências e limites

Capturas representativas:

- [Dashboard preenchido — 1366 px](validation/evidence/dashboard-preenchido-1366.png)
- [Nova Venda preenchida — 1366 px](validation/evidence/nova-venda-preenchida-1366.png)
- [Estoque selecionado — 1366 px](validation/evidence/estoque-selecionado-1366.png)
- [Vendas — 1366 px](validation/evidence/vendas-1366.png)
- [Usuários — 1366 px](validation/evidence/usuarios-1366.png)
- [Cadastro — 1366 px](validation/evidence/cadastro-1366.png)
- [Perfil e menu aberto — 1366 px](validation/evidence/perfil-menu-1366.png)
- [Perfil — 375 px](validation/evidence/perfil-375.png)
- [Resultados completos e medidas](validation/evidence/results.json)
- [Script reproduzível](validation/visual.cjs)

As capturas finais aguardam o término da animação dos gráficos. Foi feita inspeção visual de capturas desktop e mobile, além das verificações automáticas de geometria. Os testes usam eventos DOM e emulação de viewport em Chrome desktop; não substituem testes em aparelhos físicos, Safari/Firefox, leitor de tela ou navegação completa por teclado. Não foram testados todos os casos de negócio, upload de foto ou troca de senha. As tabelas mantêm rolagem horizontal interna quando necessária, sem ampliar a página.

Os dados de teste foram alterados apenas na memória da sessão mock isolada, sem editar os arquivos de dados. A aprovação visual final continua sujeita à revisão do usuário, especialmente após o fornecimento dos assets oficiais.

## Arquivos modificados

Caminhos relativos a a_frontend/glic_frontend:
- src/components/layout/Cabecalho/Cabecalho.css
- src/components/layout/Cabecalho/Cabecalho.jsx
- src/components/layout/LayoutAutenticacao/LayoutAutenticacao.css
- src/components/layout/LayoutInterno/LayoutInterno.css
- src/components/layout/LayoutInterno/LayoutInterno.jsx
- src/components/layout/MenuLateral/MenuLateral.css
- src/components/layout/MenuPerfil/MenuPerfil.css
- src/components/ui/Avatar/Avatar.css
- src/components/ui/Botao/Botao.css
- src/components/ui/CartaoKpi/CartaoKpi.css
- src/components/ui/ControleSegmentado/ControleSegmentado.css
- src/components/ui/Graficos/Graficos.css
- src/components/ui/Graficos/Graficos.jsx
- src/components/ui/SeloStatus/SeloStatus.css
- src/components/ui/Tabela/Tabela.css
- src/pages/Cadastro/Cadastro.css
- src/pages/Dashboard/Dashboard.css
- src/pages/Dashboard/Dashboard.jsx
- src/pages/Estoque/Estoque.css
- src/pages/Estoque/Estoque.jsx
- src/pages/Login/Login.css
- src/pages/NovaVenda/NovaVenda.css
- src/pages/NovaVenda/NovaVenda.jsx
- src/pages/Perfil/Perfil.css
- src/pages/Usuarios/Usuarios.css
- src/pages/Usuarios/Usuarios.jsx
- src/pages/Vendas/Vendas.css
- src/pages/Vendas/Vendas.jsx
- src/styles/tokens.css
- src/components/layout/AcoesCabecalho/AcoesCabecalho.jsx (novo componente de apresentação).
- RELATORIO_VISUAL.md (este relatório atualizado).
- validation/visual.cjs (validação local sem dependências).
- validation/evidence/results.json e 78 capturas PNG (evidências).
- dist/index.html e os bundles dist/assets/index-frH2NB7t.css e dist/assets/index-li361Wgy.js, regenerados pelo Vite; substituem os dois bundles anteriores.

Não foram implementadas novas funcionalidades de negócio. Os novos arquivos de validação e evidências documentam os critérios visuais solicitados.
