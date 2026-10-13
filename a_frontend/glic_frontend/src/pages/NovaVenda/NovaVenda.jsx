/*
 * TL03: fluxo de venda com seleção de produtos e quantidades à esquerda,
 * resumo do carrinho e total fixados no painel à direita,
 * confirmação explícita antes de registrar e mensagens de resultado.
 * Em telas menores, o resumo fica depois da lista de produtos.
 */
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { listarProdutos } from "../../services/estoqueService";
import { registrarVenda } from "../../services/vendasService";
import Botao from "../../components/ui/Botao/Botao";
import EstadoVazio from "../../components/ui/EstadoVazio/EstadoVazio";
import Alerta from "../../components/ui/Alerta/Alerta";
import "./NovaVenda.css";

const moeda = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

export default function NovaVenda() {
  const { usuario } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [desconto, setDesconto] = useState("0");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [confirmar, setConfirmar] = useState(false);

  async function carregarProdutos() {
    setCarregando(true);
    try { setProdutos([...(await listarProdutos())]); setErro(""); }
    catch { setErro("Não foi possível carregar os produtos. Tente novamente."); }
    finally { setCarregando(false); }
  }
  useEffect(() => { carregarProdutos(); }, []);

  const disponiveis = useMemo(() => produtos.filter((p) => `${p.nome} ${p.marca} ${p.categoria}`.toLowerCase().includes(busca.trim().toLowerCase())), [produtos, busca]);
  const subtotal = carrinho.reduce((s, item) => s + item.preco * item.quantidade, 0);
  const descontoNumero = Math.max(0, Number(desconto) || 0);
  const total = Math.max(0, subtotal - descontoNumero);

  function adicionar(produto) {
    setErro(""); setSucesso(""); setConfirmar(false);
    setCarrinho((atual) => {
      const existente = atual.find((item) => item.produtoId === produto.id);
      if (existente) {
        if (existente.quantidade >= produto.quantidade) { setErro(`Estoque disponível: ${produto.quantidade}.`); return atual; }
        return atual.map((item) => item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      if (produto.quantidade < 1) { setErro("Este produto está sem estoque."); return atual; }
      return [...atual, { produtoId: produto.id, nome: produto.nome, categoria: produto.categoria, preco: produto.preco, quantidade: 1, unidade: produto.unidade }];
    });
  }
  function alterarQuantidade(produtoId, quantidade) {
    const produto = produtos.find((p) => p.id === produtoId);
    const numero = Number(quantidade);
    if (!Number.isInteger(numero) || numero < 1) return remover(produtoId);
    if (numero > produto.quantidade) { setErro(`Estoque insuficiente para ${produto.nome}. Disponível: ${produto.quantidade}.`); return; }
    setErro(""); setCarrinho((atual) => atual.map((item) => item.produtoId === produtoId ? { ...item, quantidade: numero } : item));
  }
  function remover(id) { setCarrinho((atual) => atual.filter((item) => item.produtoId !== id)); setErro(""); }
  async function finalizar() {
    setConfirmar(false); setErro(""); setSucesso(""); setSalvando(true);
    try {
      const venda = await registrarVenda(carrinho, usuario, descontoNumero);
      setSucesso(`Venda ${venda.id} registrada com sucesso. Estoque e financeiro atualizados.`);
      setCarrinho([]); setDesconto("0");
      await carregarProdutos();
    } catch (e) { setErro(e.message || "Não foi possível registrar a venda."); }
    finally { setSalvando(false); }
  }

  return <section className="pagina-nova-venda" aria-label="Nova venda">
    <header className="nova-venda__cabecalho"><div><span className="nova-venda__sobretitulo">PDV</span><h1>Nova venda</h1><p>Selecione os produtos e confira o resumo antes de finalizar.</p></div><Botao variante="secundaria" onClick={carregarProdutos}>Atualizar produtos</Botao></header>
    {erro && <Alerta variante="erro">{erro}</Alerta>}
    {sucesso && <Alerta variante="sucesso">{sucesso}</Alerta>}
    {confirmar && <div className="nova-venda__confirmacao" role="alertdialog" aria-modal="true" aria-labelledby="confirmar-venda-titulo"><h2 id="confirmar-venda-titulo">Confirmar venda?</h2><p>O total será de {moeda(total)}. Ao confirmar, o estoque e o financeiro serão atualizados.</p><div><Botao variante="secundaria" onClick={() => setConfirmar(false)}>Revisar venda</Botao><Botao onClick={finalizar} carregando={salvando}>Confirmar venda</Botao></div></div>}
    <div className="nova-venda__grade">
      <section className="nova-venda__catalogo" aria-label="Catálogo de produtos">
        <label className="nova-venda__busca"><Search aria-hidden="true" /><span className="nova-venda__sr-only">Buscar produto</span><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto, marca ou categoria" /></label>
        {carregando ? <div className="nova-venda__carregando">Carregando produtos…</div> : disponiveis.length ? <div className="nova-venda__produtos">{disponiveis.map((p) => <article className="nova-venda__produto" key={p.id}><div className="nova-venda__produto-icone"><ShoppingCart aria-hidden="true" /></div><div className="nova-venda__produto-dados"><strong>{p.nome}</strong><span>{p.categoria} · {p.marca}</span><span>Disponível: {p.quantidade} {p.unidade}</span><strong>{moeda(p.preco)}</strong></div><Botao tamanho="pequeno" variante="secundaria" desabilitado={p.quantidade < 1} onClick={() => adicionar(p)}>Adicionar</Botao></article>)}</div> : <EstadoVazio texto="Nenhum produto encontrado." />}
      </section>
      <aside className="nova-venda__resumo" aria-label="Resumo da venda">
        <h2><ShoppingCart aria-hidden="true" /> Carrinho <span>{carrinho.length}</span></h2>
        {!carrinho.length ? <EstadoVazio texto="Adicione produtos para começar a venda." /> : <ul className="nova-venda__itens">{carrinho.map((item) => <li key={item.produtoId}><div className="nova-venda__item-topo"><strong>{item.nome}</strong><button type="button" onClick={() => remover(item.produtoId)} aria-label={`Remover ${item.nome}`}><Trash2 size={17} /></button></div><div className="nova-venda__quantidade"><label>Qtd. <input type="number" min="1" max={produtos.find((p) => p.id === item.produtoId)?.quantidade ?? 1} value={item.quantidade} onChange={(e) => alterarQuantidade(item.produtoId, e.target.value)} /></label><strong>{moeda(item.preco * item.quantidade)}</strong></div></li>)}</ul>}
        <div className="nova-venda__valores"><div><span>Subtotal</span><strong>{moeda(subtotal)}</strong></div><label>Desconto (R$)<input type="number" min="0" max={subtotal} step="0.01" value={desconto} onChange={(e) => setDesconto(e.target.value)} /></label><div className="nova-venda__total"><span>Total</span><strong>{moeda(total)}</strong></div></div>
        <Botao bloco onClick={() => { if (!carrinho.length) { setErro("Adicione ao menos um item para finalizar a venda."); return; } if (descontoNumero > subtotal) { setErro("O desconto não pode ser maior que o subtotal."); return; } setErro(""); setConfirmar(true); }} desabilitado={!carrinho.length || carregando || salvando}>Finalizar venda</Botao>
      </aside>
    </div>
  </section>;
}
