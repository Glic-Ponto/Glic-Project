import { useEffect, useMemo, useState } from "react";
import { Printer, Search, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { listarVendas } from "../../services/vendasService";
import { statusVenda } from "../../constants/vendas";
import { rotas } from "../../constants/rotas";
import Tabela from "../../components/ui/Tabela/Tabela";
import Alerta from "../../components/ui/Alerta/Alerta";
import DialogoVenda from "../../components/vendas/DialogoVenda";
import "./Vendas.css";

const moeda = v => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const dataBR = v => v && !Number.isNaN(new Date(v).getTime()) ? new Date(v).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Não informado";
const informado = valor => typeof valor === "string" && valor.trim() ? valor : "Não informado";
const normalizar = valor => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const statusTexto = v => statusVenda(v) === "rascunho" ? "Rascunho" : statusVenda(v) === "finalizada" ? "Finalizada" : "Não informado";

export default function Vendas() {
  const { usuario } = useAuth();
  const location = useLocation();
  const contextoAnterior = location.state?.contextoVendas;
  const [vendas, setVendas] = useState([]);
  const [busca, setBusca] = useState(() => contextoAnterior?.busca || "");
  const [status, setStatus] = useState(() => contextoAnterior?.status || "");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [selecionada, setSelecionada] = useState(null);
  const podeVender = ["FUNCIONARIO", "GERENTE", "ADMIN"].includes(usuario?.perfil);
  useEffect(() => {
    let ativo = true;
    listarVendas().then(d => { if (ativo) setVendas(d); }).catch(() => { if (ativo) setErro("Não foi possível carregar as vendas."); }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);
  const filtradas = useMemo(() => vendas.filter(v => (!status || statusVenda(v) === status) && normalizar([v.id, informado(v.cliente), informado(v.veiculo), v.usuarioNome || ""].join(" ")).includes(normalizar(busca.trim()))), [vendas, busca, status]);
  const colunas = [
    { chave: "cliente", titulo: "Cliente", render: v => <span>{informado(v.cliente)}<small className="vendas__identificador">{v.id}</small></span> },
    { chave: "veiculo", titulo: "Veículo", render: v => informado(v.veiculo) },
    { chave: "data", titulo: "Data", render: v => dataBR(v.data) },
    { chave: "total", titulo: "Valor", render: v => <strong>{moeda(v.total)}</strong> },
    { chave: "pagamento", titulo: "Pagamento", render: v => informado(v.pagamento) },
    { chave: "status", titulo: "Status", render: v => <span className={"vendas__status vendas__status--" + statusVenda(v)}>{statusTexto(v)}</span> },
    { chave: "acao", titulo: "Ações", render: v => <div className="vendas__acoes"><button className="vendas__detalhes-botao" onClick={() => setSelecionada(v)} type="button">Ver venda</button>{podeVender && v.usuarioId === usuario.id && statusVenda(v) === "rascunho" && <Link className="vendas__retomar" to={rotas.novaVenda + "?rascunho=" + encodeURIComponent(v.id)}>Retomar</Link>}{statusVenda(v) === "finalizada" && <Link className="vendas__comprovante" to={rotas.comprovanteVenda(v.id)} state={{ origemVendas: { busca, status } }} aria-label={`Imprimir comprovante da venda ${v.id}`}><Printer size={16} aria-hidden="true" />Imprimir comprovante</Link>}</div> }
  ];
  return <section className="pagina-vendas" aria-label="Vendas">
    <header className="vendas__cabecalho"><span className="vendas__resumo">{vendas.filter(v => statusVenda(v) === "finalizada").length} venda(s) finalizada(s) · {vendas.filter(v => statusVenda(v) === "rascunho").length} rascunho(s)</span>{podeVender && <Link className="ui-botao ui-botao--primario ui-botao--medio vendas__nova-venda" to={rotas.novaVenda}><Plus size={16} aria-hidden="true" />Nova venda</Link>}</header>
    {erro && <Alerta variante="erro">{erro}</Alerta>}
    <div className="vendas__filtros"><label className="vendas__pesquisa"><span>Buscar por cliente ou veículo</span><span className="vendas__busca"><Search aria-hidden="true" /><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Cliente, veículo, número ou responsável" /></span></label>{vendas.length > 0 && <label className="vendas__filtro-status">Status<select value={status} onChange={e => setStatus(e.target.value)}><option value="">Todos</option>{[...new Set(vendas.map(statusVenda))].map(s => <option key={s} value={s}>{s === "rascunho" ? "Rascunho" : s === "finalizada" ? "Finalizada" : "Não informado"}</option>)}</select></label>}</div>
    {!carregando && !vendas.length && !erro ? <div className="vendas__vazio"><p>Nenhuma venda cadastrada.</p><p>{podeVender ? "Use Nova venda para registrar os primeiros itens ou salvar um rascunho." : "As vendas registradas pelos funcionários aparecerão aqui."}</p></div> : <Tabela colunas={colunas} linhas={filtradas} carregando={carregando} vazio="Nenhuma venda encontrada para esta pesquisa." caption="Histórico de vendas e rascunhos" />}
    {selecionada && <DialogoVenda titulo={"Venda " + selecionada.id} onFechar={() => setSelecionada(null)}>
      <p>{dataBR(selecionada.data)} · {informado(selecionada.usuarioNome)} · {statusTexto(selecionada)}</p>
      <dl className="vendas__dados"><dt>Cliente</dt><dd>{informado(selecionada.cliente)}</dd><dt>Veículo</dt><dd>{informado(selecionada.veiculo)}</dd><dt>Pagamento</dt><dd>{informado(selecionada.pagamento)}</dd></dl>
      <p>Configuração: {[selecionada.configuracao?.servico, selecionada.configuracao?.tipoVeiculo, selecionada.configuracao?.area].filter(Boolean).join(" · ") || "Não informada"}</p>
      <ul className="dialogo-venda__itens">{(selecionada.itens || []).map((i, n) => <li key={i.id || n}><span>{i.nome} × {i.quantidade}<small>{[i.configuracao?.servico, i.configuracao?.tipoVeiculo, i.configuracao?.area].filter(Boolean).join(" · ")}</small></span><strong>{moeda(i.preco * i.quantidade)}</strong></li>)}</ul>
      <div className="vendas__modal-total"><span>Subtotal</span><strong>{moeda(selecionada.subtotal ?? selecionada.total)}</strong></div><div className="vendas__modal-total"><span>Desconto</span><strong>{moeda(selecionada.desconto)}</strong></div><div className="vendas__modal-total vendas__modal-total--final"><span>Total</span><strong>{moeda(selecionada.total)}</strong></div>
      {statusVenda(selecionada) === "rascunho" && <p>Rascunho: sem baixa de estoque e sem lançamento financeiro.</p>}
    </DialogoVenda>}
  </section>;
}
