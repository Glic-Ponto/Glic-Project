/*
 * TL06: resumo financeiro em KPIs, alternância entre receitas e despesas,
 * filtros textuais e tabela de lançamentos recentes.
 * Esta tela é restrita ao perfil Gestor por configuração de permissões.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import CartaoKpi from "../../components/ui/CartaoKpi/CartaoKpi";
import ControleSegmentado from "../../components/ui/ControleSegmentado/ControleSegmentado";
import Tabela from "../../components/ui/Tabela/Tabela";
import { listarReceitas, listarDespesas } from "../../services/financeiroService";
import "./Financeiro.css";

const moeda=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v||0);
const dataBR=v=>new Date(v).toLocaleDateString("pt-BR");

export default function Financeiro(){
 const [receitas,setReceitas]=useState([]);const [despesas,setDespesas]=useState([]);const [tipo,setTipo]=useState("receitas");const [carregando,setCarregando]=useState(true);
 useEffect(()=>{let ativo=true;Promise.all([listarReceitas(),listarDespesas()]).then(([r,d])=>{if(ativo){setReceitas(r);setDespesas(d)}}).finally(()=>{if(ativo)setCarregando(false)});return()=>{ativo=false}},[]);
 const totalR=receitas.reduce((s,i)=>s+i.valor,0),totalD=despesas.reduce((s,i)=>s+i.valor,0);
 const linhas=useMemo(()=> (tipo==="receitas"?receitas:despesas).map(i=>({...i,valorFormatado:moeda(i.valor)})),[tipo,receitas,despesas]);
 const colunas=[{chave:"data",titulo:"Data",render:i=>dataBR(i.data)},{chave:"descricao",titulo:"Descrição"},{chave:"categoria",titulo:"Categoria",render:i=>i.categoria||"—"},{chave:"valorFormatado",titulo:"Valor"}];
 return <section className="pagina-financeiro" aria-label="Financeiro"><header className="financeiro__cabecalho"><div><span>CONTROLE DA LOJA</span><h1>Financeiro</h1><p>Acompanhe receitas e despesas registradas.</p></div><Wallet size={28} aria-hidden="true"/></header><div className="financeiro__kpis"><CartaoKpi titulo="Receitas" valor={moeda(totalR)} carregando={carregando}/><CartaoKpi titulo="Despesas" valor={moeda(totalD)} carregando={carregando}/><CartaoKpi titulo="Resultado" valor={moeda(totalR-totalD)} carregando={carregando}/></div><div className="financeiro__tipos"><ControleSegmentado rotulo="Tipo de lançamento" opcoes={[{label:"Receitas",value:"receitas"},{label:"Despesas",value:"despesas"}]} valor={tipo} onChange={setTipo}/><span>{tipo==="receitas"?<ArrowDownLeft aria-hidden="true"/>:<ArrowUpRight aria-hidden="true"/>}{linhas.length} lançamento(s)</span></div><Tabela colunas={colunas} linhas={linhas} carregando={carregando} vazio={tipo==="receitas"?"Nenhuma receita registrada. As vendas finalizadas aparecerão aqui.":"Nenhuma despesa cadastrada."} caption={`Lançamentos de ${tipo}`}/></section>;
}
