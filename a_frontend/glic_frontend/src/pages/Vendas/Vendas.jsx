/*
 * TL04: histórico de vendas com título e indicadores compactos,
 * busca por identificador/cliente e tabela ordenada da mais recente,
 * com total, data, responsável e acesso a detalhes de cada venda.
 */
import { useEffect, useMemo, useState } from "react";
import { Search, ReceiptText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { listarVendas } from "../../services/vendasService";
import Tabela from "../../components/ui/Tabela/Tabela";
import EstadoVazio from "../../components/ui/EstadoVazio/EstadoVazio";
import "./Vendas.css";

const moeda = (v) => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v||0);
const dataBR = (v) => new Date(v).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"});

export default function Vendas() {
 const { usuario } = useAuth();
 const [vendas,setVendas]=useState([]); const [busca,setBusca]=useState(""); const [carregando,setCarregando]=useState(true); const [selecionada,setSelecionada]=useState(null);
 useEffect(()=>{let ativo=true;listarVendas().then(d=>{if(ativo)setVendas(d)}).finally(()=>{if(ativo)setCarregando(false)});return()=>{ativo=false}},[]);
 const filtradas=useMemo(()=>vendas.filter(v=>`${v.id} ${v.usuarioNome||""}`.toLowerCase().includes(busca.toLowerCase().trim())),[vendas,busca]);
 const colunas=[{chave:"id",titulo:"Venda"},{chave:"data",titulo:"Data",render:v=>dataBR(v.data)},{chave:"usuarioNome",titulo:"Responsável",render:v=>v.usuarioNome||"—"},{chave:"total",titulo:"Total",render:v=><strong>{moeda(v.total)}</strong>},{chave:"acao",titulo:"Detalhes",render:v=><button className="vendas__detalhes-botao" onClick={()=>setSelecionada(v)} type="button">Ver venda</button>}];
 return <section className="pagina-vendas" aria-label="Vendas">
  <header className="vendas__cabecalho"><div><span>HISTÓRICO</span><h1>Vendas</h1><p>Consulte as vendas registradas nesta sessão.</p></div><div className="vendas__cabecalho-acoes">{usuario?.perfil === "Funcionário" && <Link className="ui-botao ui-botao--primario ui-botao--medio vendas__nova-venda" to="/nova-venda"><Plus size={18} aria-hidden="true" />Nova venda</Link>}<div className="vendas__resumo"><ReceiptText aria-hidden="true"/><div><span>Vendas registradas</span><strong>{vendas.length}</strong></div></div></div></header>
  <label className="vendas__busca"><Search aria-hidden="true"/><span className="vendas__sr-only">Buscar venda</span><input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por número ou responsável"/></label>
  <Tabela colunas={colunas} linhas={filtradas} carregando={carregando} vazio="Nenhuma venda encontrada." caption="Histórico de vendas"/>
  {selecionada&&<div className="vendas__overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelecionada(null)}}><section className="vendas__modal" role="dialog" aria-modal="true" aria-labelledby="vendas-modal-titulo"><button className="vendas__fechar" type="button" onClick={()=>setSelecionada(null)} aria-label="Fechar detalhes">×</button><h2 id="vendas-modal-titulo">Venda {selecionada.id}</h2><p>{dataBR(selecionada.data)} · {selecionada.usuarioNome||"Responsável não informado"}</p><ul>{selecionada.itens.map((i,n)=><li key={`${i.produtoId}-${n}`}><span>{i.nome} × {i.quantidade}</span><strong>{moeda(i.preco*i.quantidade)}</strong></li>)}</ul><div className="vendas__modal-total"><span>Subtotal</span><strong>{moeda(selecionada.subtotal??selecionada.total)}</strong></div>{Boolean(selecionada.desconto)&&<div className="vendas__modal-total"><span>Desconto</span><strong>−{moeda(selecionada.desconto)}</strong></div>}<div className="vendas__modal-total vendas__modal-total--final"><span>Total</span><strong>{moeda(selecionada.total)}</strong></div></section></div>}
 </section>;
}
