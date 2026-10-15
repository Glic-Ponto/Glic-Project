import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { listarUsuarios } from "../../../services/usuariosService";
import { rotas } from "../../../constants/rotas";
import DialogoVenda from "../../vendas/DialogoVenda";
import Botao from "../../ui/Botao/Botao";
import CampoTexto from "../../ui/CampoTexto/CampoTexto";
import Alerta from "../../ui/Alerta/Alerta";

export default function TrocarContaModal({ onFechar }) {
  const { usuario, trocarConta } = useAuth();
  const navigate = useNavigate();
  const [contas, setContas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    let ativo = true;
    listarUsuarios().then((dados) => { if (ativo) setContas(dados.filter(conta => conta.ativo !== false)); }).catch(() => { if (ativo) setErro("Não foi possível carregar as contas."); }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const outrasContas = useMemo(() => contas.filter(conta => conta.id !== usuario?.id).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")), [contas, usuario?.id]);
  function escolher(conta) { setSelecionada(conta); setSenha(""); setErro(""); }
  function voltar() { if (entrando) return; setSelecionada(null); setSenha(""); setErro(""); }
  async function confirmar(evento) {
    evento.preventDefault();
    if (entrando) return;
    if (!senha) { setErro("Informe a senha da conta selecionada."); return; }
    setEntrando(true); setErro("");
    try {
      const novaConta = await trocarConta(selecionada.email, senha);
      if (novaConta.id !== selecionada.id) throw new Error("Não foi possível confirmar a conta selecionada.");
      setSenha(""); onFechar(); navigate(rotas.dashboard, { replace: true });
    } catch (falha) { setErro(falha.message || "Não foi possível entrar nesta conta."); }
    finally { setEntrando(false); }
  }
  const fechar = () => { if (!entrando) { setSenha(""); onFechar(); } };
  return <DialogoVenda titulo={selecionada ? `Entrar como ${selecionada.nome}` : "Trocar de Conta"} onFechar={fechar} classe="trocar-conta">
    {selecionada ? <form onSubmit={confirmar} className="trocar-conta__senha" noValidate>
      <p><strong>{selecionada.nome}</strong><br /><span>{selecionada.email}</span></p>
      {erro && <Alerta variante="erro">{erro}</Alerta>}
      <CampoTexto id="trocar-conta-senha" label="Senha" tipo="password" valor={senha} onChange={evento => { setSenha(evento.target.value); setErro(""); }} autoComplete="current-password" desabilitado={entrando} required />
      <div className="dialogo-venda__acoes"><Botao variante="terciario" onClick={voltar} desabilitado={entrando}><ArrowLeft size={16} aria-hidden="true" />Voltar</Botao><Botao variante="secundario" onClick={fechar} desabilitado={entrando}>Cancelar</Botao><Botao tipo="submit" carregando={entrando}>Confirmar entrada</Botao></div>
    </form> : <>
      <p>Selecione a conta que deseja acessar.</p>
      {erro && <Alerta variante="erro">{erro}</Alerta>}
      <p className="trocar-conta__atual">Conta atual: <strong>{usuario?.nome}</strong></p>
      {carregando ? <p role="status">Carregando contas…</p> : outrasContas.length ? <ul className="trocar-conta__lista">{outrasContas.map(conta => <li key={conta.id}><div><strong>{conta.nome}</strong><span>{conta.email}</span></div><Botao onClick={() => escolher(conta)}>Entrar</Botao></li>)}</ul> : <p className="trocar-conta__vazio">Não há outras contas ativas disponíveis para acesso.</p>}
      <div className="dialogo-venda__acoes"><Botao variante="secundario" onClick={fechar}>Cancelar</Botao></div>
    </>}
  </DialogoVenda>;
}
