import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Package, ShoppingBag, Trash2, Plus, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { listarProdutos } from "../../services/estoqueService";
import { obterRascunho, registrarVenda, salvarRascunho } from "../../services/vendasService";
import { tiposServico, tiposVeiculo, areasAplicacao, configuracaoVazia } from "../../constants/vendas";
import { rotas } from "../../constants/rotas";
import Botao from "../../components/ui/Botao/Botao";
import Alerta from "../../components/ui/Alerta/Alerta";
import AcoesCabecalho from "../../components/layout/AcoesCabecalho/AcoesCabecalho";
import DialogoVenda from "../../components/vendas/DialogoVenda";
import "./NovaVenda.css";

const moeda = v => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
const resumoConfig = c => [c?.servico, c?.tipoVeiculo, c?.area].filter(Boolean).join(" · ");
const novoToken = () => crypto.randomUUID();

export default function NovaVenda() {
  const { usuario } = useAuth();
  const [parametros] = useSearchParams();
  const idSolicitado = parametros.get("rascunho");
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [configuracao, setConfiguracao] = useState(configuracaoVazia);
  const [desconto, setDesconto] = useState("0");
  const [rascunhoId, setRascunhoId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [concluida, setConcluida] = useState(null);
  const [modal, setModal] = useState(null);
  const operacao = useRef(novoToken());
  const ocupado = useRef(false);
  const servicosRef = useRef(null);
  const bloqueado = carregando || salvando || Boolean(concluida);
  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    Promise.all([listarProdutos(), idSolicitado ? obterRascunho(idSolicitado, usuario) : Promise.resolve(null)]).then(([lista, rascunho]) => {
      if (!ativo) return;
      setProdutos(lista.map(p => ({ ...p })));
      setCarrinho(rascunho?.itens || []);
      setConfiguracao(rascunho?.configuracao || configuracaoVazia());
      setDesconto(String(rascunho?.desconto ?? 0));
      setRascunhoId(rascunho?.id || null);
      operacao.current = rascunho?.operacaoId || novoToken();
      setAviso(rascunho ? "Rascunho " + rascunho.id + " retomado. O estoque será conferido ao finalizar." : "");
      setConcluida(null);
    }).catch(e => { if (ativo) setErro(e.message); }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [idSolicitado, usuario]);

  const subtotal = carrinho.reduce((s, item) => s + Math.round(item.preco * 100) * item.quantidade, 0) / 100;
  const descontoNumero = Number(desconto);
  const descontoValido = desconto !== "" && Number.isFinite(descontoNumero) && descontoNumero >= 0 && descontoNumero <= subtotal;
  const total = descontoValido ? (Math.round(subtotal * 100) - Math.round(descontoNumero * 100)) / 100 : null;
  const preenchida = carrinho.length > 0 || Object.values(configuracao).some(Boolean) || desconto !== "0";
  const disponiveis = produtos.filter(p => (p.nome + " " + p.marca + " " + p.categoria).toLocaleLowerCase("pt-BR").includes(busca.trim().toLocaleLowerCase("pt-BR")));

  function editar() { setErro(""); setAviso(""); }
  function adicionar(produto) {
    if (bloqueado) return;
    editar();
    const quantidade = carrinho.filter(i => i.produtoId === produto.id).reduce((s, i) => s + i.quantidade, 0);
    if (quantidade >= produto.quantidade) { setErro("Estoque disponível de " + produto.nome + ": " + produto.quantidade + "."); return; }
    const existente = carrinho.find(i => i.produtoId === produto.id && resumoConfig(i.configuracao) === resumoConfig(configuracao));
    setCarrinho(existente ? carrinho.map(i => i.id === existente.id ? { ...i, quantidade: i.quantidade + 1 } : i) : [...carrinho, { id: novoToken(), produtoId: produto.id, nome: produto.nome, categoria: produto.categoria, preco: produto.preco, quantidade: 1, unidade: produto.unidade, configuracao: { ...configuracao } }]);
  }
  function alterarQuantidade(item, valor) {
    if (bloqueado) return;
    const numero = Number(valor);
    if (!Number.isSafeInteger(numero) || numero < 1) { setErro("Informe uma quantidade inteira maior que zero. Para excluir, use Remover."); return; }
    const outros = carrinho.filter(i => i.produtoId === item.produtoId && i.id !== item.id).reduce((s, i) => s + i.quantidade, 0);
    const produto = produtos.find(p => p.id === item.produtoId);
    if (!produto || numero + outros > produto.quantidade) { setErro("Quantidade total superior ao estoque disponível para " + item.nome + "."); return; }
    editar(); setCarrinho(carrinho.map(i => i.id === item.id ? { ...i, quantidade: numero } : i));
  }
  function limpar() {
    setCarrinho([]); setConfiguracao(configuracaoVazia()); setDesconto("0"); setRascunhoId(null);
    setConcluida(null); setModal(null); setBusca(""); editar(); operacao.current = novoToken();
  }
  async function persistir(finalizar) {
    if (ocupado.current || concluida || carregando) return;
    ocupado.current = true; setSalvando(true); setModal(null); editar();
    try {
      if (finalizar) {
        const venda = await registrarVenda(carrinho, usuario, desconto, { operacaoId: operacao.current, rascunhoId, configuracao });
        // O commit já confirmou estoque e receita; atualiza a disponibilidade exibida.
        setProdutos((await listarProdutos()).map(p => ({ ...p })));
        setConcluida(venda);
      } else {
        const rascunho = await salvarRascunho({ id: rascunhoId, operacaoId: operacao.current, itens: carrinho, desconto, configuracao }, usuario);
        setRascunhoId(rascunho.id);
        setAviso("Rascunho " + rascunho.id + " salvo. Retome em Vendas. Nenhum estoque ou lançamento financeiro foi alterado.");
      }
    } catch (e) { setErro(e.message || "Não foi possível salvar a venda."); }
    finally { ocupado.current = false; setSalvando(false); }
  }
  function opcoes(titulo, chave, valores) {
    return <section className={"nova-venda__secao nova-venda__secao--" + chave} aria-label={titulo}>
      <h2>{titulo}</h2><div className="nova-venda__opcoes">{valores.map(valor => <button ref={chave === "servico" && valor === valores[0] ? servicosRef : null} key={valor} type="button" className="nova-venda__opcao" aria-pressed={configuracao[chave] === valor} disabled={bloqueado} onClick={() => { editar(); setConfiguracao({ ...configuracao, [chave]: configuracao[chave] === valor ? "" : valor }); }}>
        {configuracao[chave] === valor && <Check size={13} aria-hidden="true" />}<span>{valor}</span>
      </button>)}</div>
    </section>;
  }
  return <section className="pagina-nova-venda" aria-label="Nova venda">
    <AcoesCabecalho><Botao variante="secundario" onClick={() => setModal("orcamento")} desabilitado={carregando}>Ver orçamento</Botao></AcoesCabecalho>
    {erro && <Alerta variante="erro">{erro}</Alerta>}
    {aviso && <Alerta>{aviso} <Link to={rotas.vendas}>Ver vendas</Link></Alerta>}
    {concluida && <Alerta variante="sucesso"><div className="nova-venda__sucesso"><div><strong>Venda {concluida.id} registrada com sucesso.</strong><p>Total: {moeda(concluida.total)}. Estoque atualizado e receita registrada no Dashboard.</p><p>{[...new Set(concluida.itens.map(i => i.produtoId))].map(id => { const p = produtos.find(p => p.id === id); return p ? p.nome + ": " + p.quantidade + " " + p.unidade + " disponíveis" : ""; }).join(" · ")}</p></div><nav aria-label="Após a venda"><Link to={rotas.estoque}>Estoque</Link><Link to={rotas.dashboard}>Dashboard</Link><Link to={rotas.vendas}>Vendas</Link></nav></div></Alerta>}
    <div className="nova-venda__grade">
      <section className="nova-venda__catalogo" aria-label="Configuração e produtos">
        {opcoes("Tipos de serviço", "servico", tiposServico)}
        {opcoes("Tipos de veículo", "tipoVeiculo", tiposVeiculo)}
        {opcoes("Área de aplicação", "area", areasAplicacao)}
        <section className="nova-venda__secao nova-venda__secao--produtos" aria-label="Tipos de produto">
          <h2>Tipos de produto</h2>
          <label className="nova-venda__busca"><Search size={14} aria-hidden="true" /><span className="nova-venda__sr-only">Buscar produto</span><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar produto" /></label>
          {carregando ? <p role="status">Carregando produtos…</p> : <div className="nova-venda__produtos">{disponiveis.map(p => <button className="nova-venda__produto" key={p.id} type="button" aria-label={"Adicionar " + p.nome} aria-pressed={carrinho.some(i => i.produtoId === p.id)} disabled={bloqueado || p.quantidade < 1} onClick={() => adicionar(p)}>
            <span className="nova-venda__produto-icone"><Package size={24} aria-hidden="true" /></span><span className="nova-venda__produto-dados"><strong>{p.nome}</strong><span>{moeda(p.preco)}</span><small>{p.quantidade > 0 ? p.quantidade + " " + p.unidade + " disponíveis" : "Sem estoque"}</small></span>
          </button>)}</div>}
          {!carregando && !disponiveis.length && <p>Nenhum produto encontrado.</p>}
        </section>
      </section>
      <aside className="nova-venda__resumo" aria-label="Resumo da venda">
        <div className="nova-venda__resumo-topo"><h2>Itens da venda</h2><Botao variante="terciario" desabilitado={!preenchida || salvando || carregando} onClick={() => setModal("limpar")}>Limpar</Botao></div>
        {!carrinho.length ? <div className="nova-venda__vazio"><ShoppingBag size={24} aria-hidden="true" /><p>Adicione produtos para começar.</p></div> : <ul className="nova-venda__itens">{carrinho.map(item => <li key={item.id}><div className="nova-venda__item-topo"><Package size={20} aria-hidden="true" /><strong>{item.nome}</strong><button type="button" disabled={bloqueado} onClick={() => { editar(); setCarrinho(carrinho.filter(i => i.id !== item.id)); }} aria-label={"Remover " + item.nome}><Trash2 size={15} /></button></div><small>{resumoConfig(item.configuracao) || "Serviço não informado"}</small><div className="nova-venda__quantidade"><label>Qtd. <input type="number" min="1" step="1" value={item.quantidade} disabled={bloqueado} onChange={e => alterarQuantidade(item, e.target.value)} aria-label={"Quantidade de " + item.nome} /></label><strong>{moeda(item.preco * item.quantidade)}</strong></div></li>)}</ul>}
        <button className="nova-venda__adicionar-servico" type="button" disabled={bloqueado} onClick={() => { servicosRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); servicosRef.current?.focus({ preventScroll: true }); setAviso("Selecione o serviço e adicione um produto. As opções serão guardadas nesse item, sem cobrança adicional de serviço."); }}><Plus size={14} aria-hidden="true" />Adicionar serviço</button>
        <div className="nova-venda__valores"><div><span>Subtotal</span><strong>{moeda(subtotal)}</strong></div><label>Desconto (R$)<input type="number" min="0" max={subtotal} step="0.01" value={desconto} disabled={bloqueado} aria-invalid={!descontoValido} aria-describedby={!descontoValido ? "desconto-erro" : undefined} onChange={e => { editar(); setDesconto(e.target.value); }} /></label>{!descontoValido && <p id="desconto-erro" role="alert">Informe um desconto entre zero e o subtotal.</p>}<div className="nova-venda__total"><span>Total</span><strong>{total === null ? "—" : moeda(total)}</strong></div></div>
        <div className="nova-venda__acoes"><Botao variante="terciario" desabilitado={bloqueado || !preenchida || !descontoValido} onClick={() => persistir(false)}>Salvar</Botao><Botao desabilitado={bloqueado || !carrinho.length || !descontoValido} onClick={() => setModal("finalizar")}>{salvando ? "Salvando…" : concluida ? "Venda finalizada" : "Finalizar venda"}</Botao></div>
      </aside>
    </div>
    {modal && <DialogoVenda classe={modal === "finalizar" ? "nova-venda__confirmacao" : ""} titulo={modal === "limpar" ? "Limpar venda?" : modal === "finalizar" ? "Confirmar venda?" : "Orçamento da venda"} onFechar={() => setModal(null)}>
      {modal === "limpar" ? <><p>Descartar os itens e as seleções desta tela? O estoque e o financeiro não serão alterados.{rascunhoId && " O rascunho já salvo continuará no histórico."}</p><div className="dialogo-venda__acoes"><Botao variante="secundario" onClick={() => setModal(null)}>Continuar editando</Botao><Botao onClick={limpar}>Confirmar limpeza</Botao></div></> : <>
        {modal === "orcamento" && <><p>Configuração atual: {resumoConfig(configuracao) || "Não informada"}</p><ul className="dialogo-venda__itens">{carrinho.map(i => <li key={i.id}><span>{i.nome} × {i.quantidade}<small>{resumoConfig(i.configuracao)}</small></span><strong>{moeda(i.preco * i.quantidade)}</strong></li>)}</ul>{!carrinho.length && <p>Nenhum item selecionado.</p>}<p>Subtotal: {moeda(subtotal)} · Desconto: {descontoValido ? moeda(descontoNumero) : "Inválido"}</p></>}
        <p>Total: <strong>{total === null ? "Revise o desconto" : moeda(total)}</strong>.</p>
        <p>{modal === "finalizar" ? "Ao confirmar, o estoque será baixado e a receita será registrada no Dashboard." : "Sem cobrança adicional por serviço, tipo de veículo ou área. Cliente, veículo e pagamento: não informados."}</p>
        <div className="dialogo-venda__acoes"><Botao variante="secundario" onClick={() => setModal(null)}>{modal === "finalizar" ? "Revisar venda" : "Fechar orçamento"}</Botao>{modal === "finalizar" && <Botao onClick={() => persistir(true)} desabilitado={salvando}>Confirmar venda</Botao>}</div>
      </>}
    </DialogoVenda>}
  </section>;
}
