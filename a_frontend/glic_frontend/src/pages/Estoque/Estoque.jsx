/*
 * TL05: quatro KPIs no topo, busca e filtros acima da lista de produtos,
 * paginação abaixo das linhas e painel de detalhes com abas ao lado.
 * Em telas menores, o painel de detalhes passa a uma gaveta/tela sobre a lista.
 */
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ImagePlus, Package, Plus, Search } from "lucide-react";
import CartaoKpi from "../../components/ui/CartaoKpi/CartaoKpi";
import SeloStatus from "../../components/ui/SeloStatus/SeloStatus";
import Abas from "../../components/ui/Abas/Abas";
import Paginacao from "../../components/ui/Paginacao/Paginacao";
import EstadoVazio from "../../components/ui/EstadoVazio/EstadoVazio";
import Botao from "../../components/ui/Botao/Botao";
import { atualizarProduto, cadastrarProduto, listarProdutos } from "../../services/estoqueService";
import { movimentacoesMock } from "../../mocks/estoque";
import { useAuth } from "../../contexts/AuthContext";
import { textos } from "../../constants/textos";
import DialogoVenda from "../../components/vendas/DialogoVenda";
import "./Estoque.css";

const moeda = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);
const itensPorPagina = 5;
const formularioInicial = { nome: "", categoria: "", marca: "", quantidade: "", preco: "", minimo: "", unidade: "un.", imagem: null };
const tiposImagem = ["image/jpeg", "image/png", "image/webp"];
const tamanhoMaximoImagem = 5 * 1024 * 1024;
const paraFormulario = (produto) => ({ nome: produto.nome, categoria: produto.categoria, marca: produto.marca, quantidade: String(produto.quantidade), preco: String(produto.preco), minimo: String(produto.minimo), unidade: produto.unidade, imagem: produto.imagem || null });
const normalizarFiltro = (valor) => valor.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const opcoesFiltro = (produtos, campo) => {
  const valores = new Map();
  produtos.forEach(produto => { const valor = produto[campo]?.trim(); if (valor && !valores.has(normalizarFiltro(valor))) valores.set(normalizarFiltro(valor), valor); });
  return [...valores.values()].sort((a, b) => a.localeCompare(b, "pt-BR"));
};

export default function Estoque() {
  const t = textos.estoque;
  const { usuario } = useAuth();
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
  const [modoFormulario, setModoFormulario] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [formularioOriginal, setFormularioOriginal] = useState(formularioInicial);
  const [errosFormulario, setErrosFormulario] = useState({});
  const [salvandoProduto, setSalvandoProduto] = useState(false);
  const [confirmarDescarte, setConfirmarDescarte] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const podeCadastrar = ["Gestor", "Funcionário"].includes(usuario?.perfil);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    listarProdutos().then((dados) => {
      if (ativo) { setProdutos([...dados]); setErro(false); }
    }).catch(() => { if (ativo) setErro(true); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const categorias = useMemo(() => opcoesFiltro(produtos, "categoria"), [produtos]);
  const marcas = useMemo(() => opcoesFiltro(produtos, "marca"), [produtos]);
  useEffect(() => {
    if (categoria && !categorias.includes(categoria)) setCategoria("");
    if (marca && !marcas.includes(marca)) setMarca("");
  }, [categorias, marcas, categoria, marca]);
  const filtrados = useMemo(() => produtos.filter((p) => {
    const q = busca.trim().toLocaleLowerCase("pt-BR");
    const estado = p.quantidade === 0 ? "sem-estoque" : p.quantidade <= p.minimo ? "baixo" : "disponivel";
    return (!q || `${p.nome} ${p.marca} ${p.categoria}`.toLocaleLowerCase("pt-BR").includes(q))
      && (!categoria || normalizarFiltro(p.categoria) === normalizarFiltro(categoria)) && (!marca || normalizarFiltro(p.marca) === normalizarFiltro(marca)) && (!status || estado === status);
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
  const formularioAlterado = modoFormulario === "editar" && JSON.stringify(formulario) !== JSON.stringify(formularioOriginal);
  function descartarFormulario() {
    setModoFormulario(null); setFormulario(formularioInicial); setFormularioOriginal(formularioInicial); setErrosFormulario({}); setConfirmarDescarte(false);
  }
  function fecharFormulario() {
    if (salvandoProduto) return;
    if (formularioAlterado) { setConfirmarDescarte(true); return; }
    descartarFormulario();
  }
  function abrirNovoProduto() { setSucesso(""); setFormulario(formularioInicial); setFormularioOriginal(formularioInicial); setModoFormulario("novo"); }
  function abrirEditarProduto() {
    if (!produtoAtual) return;
    const dados = paraFormulario(produtoAtual);
    setSucesso(""); setFormulario(dados); setFormularioOriginal(dados); setErrosFormulario({}); setModoFormulario("editar");
  }
  function alterarCampo(campo, valor) { setFormulario(atual => ({ ...atual, [campo]: valor })); setErrosFormulario(atual => ({ ...atual, [campo]: "", geral: "" })); }
  function validarFormulario() {
    const erros = {};
    if (!formulario.nome.trim()) erros.nome = "Informe o nome do produto.";
    if (!formulario.categoria.trim()) erros.categoria = "Informe a categoria.";
    else if (formulario.categoria.trim().length > 80) erros.categoria = "A categoria deve ter no máximo 80 caracteres.";
    if (!formulario.marca.trim()) erros.marca = "Informe a marca.";
    else if (formulario.marca.trim().length > 80) erros.marca = "A marca deve ter no máximo 80 caracteres.";
    if (!/^\d+$/.test(formulario.quantidade)) erros.quantidade = "Informe uma quantidade inteira não negativa.";
    if (formulario.preco === "" || !Number.isFinite(Number(formulario.preco)) || Number(formulario.preco) < 0) erros.preco = "Informe um preço não negativo.";
    if (!/^\d+$/.test(formulario.minimo)) erros.minimo = "Informe um estoque mínimo inteiro não negativo.";
    return erros;
  }
  function selecionarImagem(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (!tiposImagem.includes(arquivo.type)) { setErrosFormulario(atual => ({ ...atual, imagem: "Use uma imagem JPG, PNG ou WebP." })); evento.target.value = ""; return; }
    if (arquivo.size > tamanhoMaximoImagem) { setErrosFormulario(atual => ({ ...atual, imagem: "A imagem deve ter no máximo 5 MB." })); evento.target.value = ""; return; }
    alterarCampo("imagem", URL.createObjectURL(arquivo));
  }
  async function salvarProduto(evento) {
    evento.preventDefault();
    if (salvandoProduto) return;
    const erros = validarFormulario();
    if (Object.keys(erros).length) { setErrosFormulario(erros); return; }
    setSalvandoProduto(true);
    try {
      const dadosFormulario = { ...formulario, quantidade: Number(formulario.quantidade), preco: Number(formulario.preco), minimo: Number(formulario.minimo) };
      const produto = modoFormulario === "editar" ? await atualizarProduto(produtoAtual.id, dadosFormulario) : await cadastrarProduto(dadosFormulario);
      const dados = await listarProdutos();
      setProdutos([...dados]); setSelecionado(produto); setAba("geral"); setPagina(1); setBusca(""); setCategoria(""); setMarca(""); setStatus("");
      descartarFormulario(); setSucesso(modoFormulario === "editar" ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
    } catch (e) { setErrosFormulario(atual => ({ ...atual, geral: e.message || "Não foi possível cadastrar o produto." })); }
    finally { setSalvandoProduto(false); }
  }

  return <section className="pagina-estoque" aria-labelledby="titulo-pagina">
    <div className="estoque__kpis">
      <CartaoKpi titulo={t.produtosCadastrados} valor={String(produtos.length)} carregando={carregando} />
      <CartaoKpi titulo={t.estoqueTotal} valor={moeda(estoqueTotal)} carregando={carregando} />
      <CartaoKpi titulo={t.estoqueBaixo} valor={String(baixos)} carregando={carregando} />
      <CartaoKpi titulo={t.semEstoque} valor={String(semEstoque)} carregando={carregando} />
    </div>
    {podeCadastrar && <div className="estoque__acoes-topo"><Botao variante="primario" className="estoque__novo" onClick={abrirNovoProduto}><Plus size={16} aria-hidden="true" />{t.novoProduto}</Botao></div>}
    {erro && <div className="estoque__erro" role="alert" aria-live="assertive"><AlertCircle aria-hidden="true" />{textos.comuns.erroConexao}</div>}
    {sucesso && <div className="estoque__sucesso" role="status">{sucesso}</div>}
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
        <div className="estoque__detalhe-topo"><Botao variante="secundario" tamanho="pequeno" onClick={() => setSelecionado(null)} className="estoque__voltar">{t.voltarLista}</Botao></div><div className="estoque__painel">
        {!produtoAtual ? <EstadoVazio icone={<Package aria-hidden="true" />} texto={t.selecionarProduto} /> : <>
          <div className="estoque__produto-resumo"><div className="estoque__produto-grande"><Package aria-hidden="true" /></div><div><h2>{produtoAtual.nome}</h2><p>{produtoAtual.marca}</p><strong>{moeda(produtoAtual.preco)}</strong><p>Quantidade: {produtoAtual.quantidade} {produtoAtual.unidade}</p><SeloStatus {...estadoProduto(produtoAtual)} /></div></div>
          <Abas abas={abas} ativa={aba} onChange={setAba} />
          <div className="estoque__aba-conteudo" role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`}>
            {aba === "geral" && <><h3>{t.detalhesProduto}</h3><dl><dt>Categoria</dt><dd>{produtoAtual.categoria}</dd><dt>Marca</dt><dd>{produtoAtual.marca}</dd><dt>Preço unitário</dt><dd>{moeda(produtoAtual.preco)}</dd><dt>Quantidade</dt><dd>{produtoAtual.quantidade} {produtoAtual.unidade}</dd><dt>Estoque mínimo</dt><dd>{produtoAtual.minimo} {produtoAtual.unidade}</dd></dl></>}
            {aba === "movimentacoes" && (movimentacoesMock.filter((m) => m.produtoId === produtoAtual.id).length ? <ul>{movimentacoesMock.filter((m) => m.produtoId === produtoAtual.id).map((m) => <li key={m.id}>{m.tipo}: {m.quantidade} · {new Date(m.data).toLocaleDateString("pt-BR")}</li>)}</ul> : <EstadoVazio texto={t.semMovimentacoes} />)}
            {aba === "fornecedores" && <EstadoVazio texto={t.semFornecedores} />}
          </div>
          <div className="estoque__acoes">{podeCadastrar && <Botao variante="secundario" onClick={abrirEditarProduto}>{t.editarProduto}</Botao>}<Botao variante="secundario" onClick={() => setAba("movimentacoes")}>{t.historico}</Botao><Botao variante="secundario" onClick={atualizarLista}>Atualizar estoque</Botao></div>
        </>}
        </div>
      </aside>
    </div>
    {modoFormulario && <DialogoVenda titulo={confirmarDescarte ? "Descartar alterações?" : modoFormulario === "editar" ? "Editar produto" : "Novo produto"} onFechar={confirmarDescarte ? () => setConfirmarDescarte(false) : fecharFormulario} classe="estoque__dialogo-novo">
      {confirmarDescarte ? <><p>As alterações não salvas serão perdidas.</p><div className="dialogo-venda__acoes"><Botao variante="secundario" onClick={() => setConfirmarDescarte(false)}>Continuar editando</Botao><Botao onClick={descartarFormulario}>Descartar alterações</Botao></div></> : <form className="estoque__formulario" onSubmit={salvarProduto} noValidate>
        {errosFormulario.geral && <p className="estoque__form-erro" role="alert">{errosFormulario.geral}</p>}
        <label className="estoque__imagem-campo"><span>Imagem do produto <small>(opcional, JPG, PNG ou WebP; até 5 MB)</small></span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={selecionarImagem} />{formulario.imagem ? <img src={formulario.imagem} alt="Pré-visualização do produto" /> : <span className="estoque__imagem-vazia"><ImagePlus aria-hidden="true" />Sem imagem selecionada</span>}</label>
        {errosFormulario.imagem && <p className="estoque__form-erro" role="alert">{errosFormulario.imagem}</p>}
        <div className="estoque__formulario-grade">
          <label>Nome do produto<input value={formulario.nome} onChange={e => alterarCampo("nome", e.target.value)} aria-invalid={Boolean(errosFormulario.nome)} />{errosFormulario.nome && <small>{errosFormulario.nome}</small>}</label>
          <label>Categoria<input value={formulario.categoria} maxLength="80" placeholder="Digite a categoria do produto" onChange={e => alterarCampo("categoria", e.target.value)} aria-invalid={Boolean(errosFormulario.categoria)} />{errosFormulario.categoria && <small>{errosFormulario.categoria}</small>}</label>
          <label>Marca<input value={formulario.marca} maxLength="80" placeholder="Digite a marca do produto" onChange={e => alterarCampo("marca", e.target.value)} aria-invalid={Boolean(errosFormulario.marca)} />{errosFormulario.marca && <small>{errosFormulario.marca}</small>}</label>
          <label>Quantidade<input inputMode="numeric" value={formulario.quantidade} onChange={e => alterarCampo("quantidade", e.target.value)} aria-invalid={Boolean(errosFormulario.quantidade)} />{errosFormulario.quantidade && <small>{errosFormulario.quantidade}</small>}</label>
          <label>Preço (R$)<input inputMode="decimal" value={formulario.preco} onChange={e => alterarCampo("preco", e.target.value.replace(",", "."))} aria-invalid={Boolean(errosFormulario.preco)} />{errosFormulario.preco && <small>{errosFormulario.preco}</small>}</label>
          <label>Estoque mínimo<input inputMode="numeric" value={formulario.minimo} onChange={e => alterarCampo("minimo", e.target.value)} aria-invalid={Boolean(errosFormulario.minimo)} />{errosFormulario.minimo && <small>{errosFormulario.minimo}</small>}</label>
        </div>
        <p className="estoque__unidade">Unidade de medida: un.</p>
        <div className="dialogo-venda__acoes"><Botao variante="secundario" onClick={fecharFormulario} desabilitado={salvandoProduto}>Cancelar</Botao><Botao tipo="submit" carregando={salvandoProduto}>{modoFormulario === "editar" ? "Salvar alterações" : "Salvar produto"}</Botao></div>
      </form>}
    </DialogoVenda>}
  </section>;
}
