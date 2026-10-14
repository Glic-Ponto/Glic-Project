/*
 * TL05: quatro KPIs no topo, busca e filtros acima da lista de produtos,
 * paginação abaixo das linhas e painel de detalhes com abas ao lado.
 * Em telas menores, o painel de detalhes passa a uma gaveta/tela sobre a lista.
 */
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Package, Search } from "lucide-react";
import CartaoKpi from "../../components/ui/CartaoKpi/CartaoKpi";
import SeloStatus from "../../components/ui/SeloStatus/SeloStatus";
import Abas from "../../components/ui/Abas/Abas";
import Paginacao from "../../components/ui/Paginacao/Paginacao";
import EstadoVazio from "../../components/ui/EstadoVazio/EstadoVazio";
import Botao from "../../components/ui/Botao/Botao";
import { listarProdutos } from "../../services/estoqueService";
import { movimentacoesMock } from "../../mocks/estoque";
import { textos } from "../../constants/textos";
import "./Estoque.css";

const moeda = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);
const itensPorPagina = 5;

export default function Estoque() {
  const t = textos.estoque;
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [status, setStatus] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [aba, setAba] = useState("geral");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    listarProdutos().then((dados) => {
      if (ativo) { setProdutos([...dados]); setErro(false); }
    }).catch(() => { if (ativo) setErro(true); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const categorias = useMemo(() => [...new Set(produtos.map((p) => p.categoria))], [produtos]);
  const marcas = useMemo(() => [...new Set(produtos.map((p) => p.marca))], [produtos]);
  const filtrados = useMemo(() => produtos.filter((p) => {
    const q = busca.trim().toLocaleLowerCase("pt-BR");
    const estado = p.quantidade === 0 ? "sem-estoque" : p.quantidade <= p.minimo ? "baixo" : "disponivel";
    return (!q || `${p.nome} ${p.marca} ${p.categoria}`.toLocaleLowerCase("pt-BR").includes(q))
      && (!categoria || p.categoria === categoria) && (!marca || p.marca === marca) && (!status || estado === status);
  }), [produtos, busca, categoria, marca, status]);
  const paginas = Math.max(1, Math.ceil(filtrados.length / itensPorPagina));
  const visiveis = filtrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);
  const estoqueTotal = produtos.reduce((total, p) => total + p.preco * p.quantidade, 0);
  const baixos = produtos.filter((p) => p.quantidade > 0 && p.quantidade <= p.minimo).length;
  const semEstoque = produtos.filter((p) => p.quantidade === 0).length;
  const produtoAtual = selecionado ? produtos.find((p) => p.id === selecionado.id) || selecionado : null;
  const abas = [{ id: "geral", label: t.geral }, { id: "movimentacoes", label: t.movimentacoes }, { id: "fornecedores", label: t.fornecedores }];

  function estadoProduto(produto) {
    if (produto.quantidade === 0) return { texto: "Sem estoque", variante: "erro" };
    if (produto.quantidade <= produto.minimo) return { texto: "Estoque baixo", variante: "alerta" };
    return { texto: "Disponível", variante: "sucesso" };
  }
  function atualizarLista() {
    listarProdutos().then((dados) => setProdutos([...dados])).catch(() => setErro(true));
  }

  return <section className="pagina-estoque" aria-labelledby="titulo-pagina">
    <div className="estoque__kpis">
      <CartaoKpi titulo={t.produtosCadastrados} valor={String(produtos.length)} carregando={carregando} />
      <CartaoKpi titulo={t.estoqueTotal} valor={moeda(estoqueTotal)} carregando={carregando} />
      <CartaoKpi titulo={t.estoqueBaixo} valor={String(baixos)} carregando={carregando} />
      <CartaoKpi titulo={t.semEstoque} valor={String(semEstoque)} carregando={carregando} />
    </div>
    {erro && <div className="estoque__erro" role="alert" aria-live="assertive"><AlertCircle aria-hidden="true" />{textos.comuns.erroConexao}</div>}
    <div className="estoque__corpo">
      <section className="estoque__lista" aria-label="Lista de produtos">
        <div className="estoque__filtros">
          <label className="estoque__busca"><span>{t.buscarProduto}</span><Search aria-hidden="true" /><input type="search" placeholder={t.buscarProduto} value={busca} onChange={(e) => { setBusca(e.target.value); setPagina(1); }} /></label>
          <label><span>{t.categoria}</span><select value={categoria} onChange={(e) => { setCategoria(e.target.value); setPagina(1); }}><option value="">{t.categoria}</option>{categorias.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span>{t.marca}</span><select value={marca} onChange={(e) => { setMarca(e.target.value); setPagina(1); }}><option value="">{t.marca}</option>{marcas.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span>{t.status}</span><select value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}><option value="">{t.status}</option><option value="disponivel">Disponível</option><option value="baixo">Estoque baixo</option><option value="sem-estoque">Sem estoque</option></select></label>
        </div>
        {carregando ? <div className="estoque__linhas-esqueleto" aria-label="Carregando produtos" /> : visiveis.length ? <ul className="estoque__produtos">
          {visiveis.map((produto) => {
            const estado = estadoProduto(produto);
            return <li key={produto.id}><button type="button" className={`estoque__produto ${produtoAtual?.id === produto.id ? "estoque__produto--ativo" : ""}`} onClick={() => { setSelecionado(produto); setAba("geral"); }}>
              <span className="estoque__produto-imagem"><Package aria-hidden="true" /></span><span className="estoque__produto-info"><strong>{produto.nome}</strong><span>{produto.categoria} · {produto.marca}</span><span>Quantidade: {produto.quantidade} {produto.unidade}</span></span><span className="estoque__produto-saldo"><SeloStatus texto={estado.texto} variante={estado.variante} /><strong>{moeda(produto.preco)}</strong></span>
            </button></li>;
          })}
        </ul> : <EstadoVazio texto={t.nenhumProduto} />}
        <Paginacao pagina={pagina} totalPaginas={paginas} onChange={setPagina} />
      </section>
      <aside className={`estoque__detalhe ${produtoAtual ? "estoque__detalhe--aberto" : ""}`} aria-label="Detalhes do produto">
        <div className="estoque__detalhe-topo"><Botao variante="secundario" tamanho="pequeno" onClick={() => setSelecionado(null)} className="estoque__voltar">{t.voltarLista}</Botao><Botao variante="primario" className="estoque__novo" desabilitado>{t.novoProduto}</Botao></div><div className="estoque__painel">
        {!produtoAtual ? <EstadoVazio icone={<Package aria-hidden="true" />} texto={t.selecionarProduto} /> : <>
          <div className="estoque__produto-resumo"><div className="estoque__produto-grande"><Package aria-hidden="true" /></div><div><h2>{produtoAtual.nome}</h2><p>{produtoAtual.marca}</p><strong>{moeda(produtoAtual.preco)}</strong><p>Quantidade: {produtoAtual.quantidade} {produtoAtual.unidade}</p><SeloStatus {...estadoProduto(produtoAtual)} /></div></div>
          <Abas abas={abas} ativa={aba} onChange={setAba} />
          <div className="estoque__aba-conteudo" role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`}>
            {aba === "geral" && <><h3>{t.detalhesProduto}</h3><dl><dt>Categoria</dt><dd>{produtoAtual.categoria}</dd><dt>Marca</dt><dd>{produtoAtual.marca}</dd><dt>Preço unitário</dt><dd>{moeda(produtoAtual.preco)}</dd><dt>Quantidade</dt><dd>{produtoAtual.quantidade} {produtoAtual.unidade}</dd><dt>Estoque mínimo</dt><dd>{produtoAtual.minimo} {produtoAtual.unidade}</dd></dl></>}
            {aba === "movimentacoes" && (movimentacoesMock.filter((m) => m.produtoId === produtoAtual.id).length ? <ul>{movimentacoesMock.filter((m) => m.produtoId === produtoAtual.id).map((m) => <li key={m.id}>{m.tipo}: {m.quantidade} · {new Date(m.data).toLocaleDateString("pt-BR")}</li>)}</ul> : <EstadoVazio texto={t.semMovimentacoes} />)}
            {aba === "fornecedores" && <EstadoVazio texto={t.semFornecedores} />}
          </div>
          <div className="estoque__acoes"><Botao variante="secundario" desabilitado>{t.editarProduto}</Botao><Botao variante="secundario" onClick={() => setAba("movimentacoes")}>{t.historico}</Botao><Botao variante="secundario" onClick={atualizarLista}>Atualizar estoque</Botao></div>
        </>}
        </div>
      </aside>
    </div>
  </section>;
}
