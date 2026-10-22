/* TL09: o conteúdo começa abaixo do cabeçalho e é centralizado na área à direita do menu lateral. Primeiro há um cartão escuro com avatar, nome, perfil e ações de foto. Abaixo, outro painel escuro reúne Informações pessoais e Segurança, separados por uma linha. Cada grupo tem seus campos e botão Salvar alinhado à direita. */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { textos } from "../../constants/textos";
import { useAuth } from "../../contexts/AuthContext";
import Botao from "../../components/ui/Botao/Botao";
import CampoTexto from "../../components/ui/CampoTexto/CampoTexto";
import Alerta from "../../components/ui/Alerta/Alerta";
import Avatar from "../../components/ui/Avatar/Avatar";
import DialogoVenda from "../../components/vendas/DialogoVenda";
import "./Perfil.css";

export default function Perfil() {
  const { usuario, atualizarPerfil, alterarSenha } = useAuth();
  const location = useLocation();
  const [dados, setDados] = useState({ nome: usuario?.nome || "", email: usuario?.email || "" });
  const [senhas, setSenhas] = useState({ atual: "", nova: "", confirmar: "" });
  const [foto, setFoto] = useState(usuario?.foto || "");
  const [errosDados, setErrosDados] = useState({});
  const [errosSenha, setErrosSenha] = useState({});
  const [mensagemDados, setMensagemDados] = useState("");
  const [mensagemSenha, setMensagemSenha] = useState("");
  const [tipoDados, setTipoDados] = useState("sucesso");
  const [tipoSenha, setTipoSenha] = useState("sucesso");
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [carregandoSenha, setCarregandoSenha] = useState(false);
  const [mensagemFoto, setMensagemFoto] = useState("");
  const [tipoFoto, setTipoFoto] = useState("sucesso");
  const [confirmarRemocao, setConfirmarRemocao] = useState(false);
  const [removendoFoto, setRemovendoFoto] = useState(false);
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaAtualRef = useRef(null);
  const senhaNovaRef = useRef(null);
  const confirmarRef = useRef(null);
  const inputFotoRef = useRef(null);
  const segurancaRef = useRef(null);

  useEffect(() => {
    setDados({ nome: usuario?.nome || "", email: usuario?.email || "" });
    setFoto(usuario?.foto || "");
  }, [usuario]);

  useEffect(() => {
    if (location.hash === "#seguranca") {
      segurancaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      senhaAtualRef.current?.focus({ preventScroll: true });
    }
  }, [location.hash]);

  function alterarDados(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErrosDados((atual) => ({ ...atual, [campo]: "" }));
  }

  function alterarSenhas(campo, valor) {
    setSenhas((atual) => ({ ...atual, [campo]: valor }));
    setErrosSenha((atual) => ({ ...atual, [campo]: "" }));
  }

  async function salvarDados(evento) {
    evento.preventDefault();
    setMensagemDados("");
    const novosErros = {};
    if (!dados.nome.trim()) novosErros.nome = textos.comuns.campoObrigatorio;
    if (!dados.email.trim()) novosErros.email = textos.comuns.campoObrigatorio;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) novosErros.email = textos.comuns.emailInvalido;
    setErrosDados(novosErros);
    const primeiroErro = Object.keys(novosErros)[0];
    if (primeiroErro) { (primeiroErro === "nome" ? nomeRef : emailRef).current?.focus(); return; }
    setCarregandoDados(true);
    try {
      await atualizarPerfil({ nome: dados.nome.trim(), email: dados.email.trim(), foto });
      setTipoDados("sucesso");
      setMensagemDados(textos.perfil.sucessoDados);
    } catch (erro) {
      setTipoDados("erro");
      setMensagemDados(erro.message || textos.comuns.erroConexao);
    } finally { setCarregandoDados(false); }
  }

  async function salvarSenha(evento) {
    evento.preventDefault();
    setMensagemSenha("");
    const novosErros = {};
    if (!senhas.atual) novosErros.atual = textos.comuns.campoObrigatorio;
    if (!senhas.nova) novosErros.nova = textos.comuns.campoObrigatorio;
    if (!senhas.confirmar) novosErros.confirmar = textos.comuns.campoObrigatorio;
    else if (senhas.nova && senhas.nova !== senhas.confirmar) novosErros.confirmar = textos.perfil.erroSenha;
    setErrosSenha(novosErros);
    const primeiroErro = Object.keys(novosErros)[0];
    if (primeiroErro) {
      ({ atual: senhaAtualRef, nova: senhaNovaRef, confirmar: confirmarRef })[primeiroErro].current?.focus();
      if (senhas.nova && senhas.confirmar && senhas.nova !== senhas.confirmar) { setTipoSenha("erro"); setMensagemSenha(textos.perfil.erroSenha); }
      return;
    }
    setCarregandoSenha(true);
    try {
      await alterarSenha(senhas.atual, senhas.nova);
      setTipoSenha("sucesso");
      setMensagemSenha(textos.perfil.sucessoSenha);
      setSenhas({ atual: "", nova: "", confirmar: "" });
    } catch (erro) {
      setTipoSenha("erro");
      setMensagemSenha(erro.message || textos.comuns.erroConexao);
      if (erro.message === textos.perfil.erroSenhaAtual) {
        setErrosSenha((atual) => ({ ...atual, atual: textos.perfil.erroSenhaAtual }));
        senhaAtualRef.current?.focus();
      }
    } finally { setCarregandoSenha(false); }
  }

  function selecionarFoto(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => setFoto(String(leitor.result || ""));
    leitor.readAsDataURL(arquivo);
  }

  function removerFoto() {
    setConfirmarRemocao(true);
  }

  async function confirmarRemocaoFoto() {
    setRemovendoFoto(true);
    setMensagemFoto("");
    try {
      // Remove no backend mantendo o nome e o e-mail já salvos.
      await atualizarPerfil({ nome: usuario?.nome || "", email: usuario?.email || "", foto: "" });
      setFoto("");
      if (inputFotoRef.current) inputFotoRef.current.value = "";
      setTipoFoto("sucesso");
      setMensagemFoto(textos.perfil.sucessoRemoverFoto);
    } catch (erro) {
      setTipoFoto("erro");
      setMensagemFoto(erro.message || textos.comuns.erroConexao);
    } finally {
      setRemovendoFoto(false);
      setConfirmarRemocao(false);
    }
  }

  return <section className="pagina-perfil" aria-labelledby="perfil-identificacao-titulo">
    <div className="perfil-coluna">
      <section className="perfil-formularios" aria-label={textos.perfil.titulo}>
        <div className="perfil-identificacao">
          <Avatar nome={usuario?.nome || ""} src={foto} tamanho="grande" />
          <div className="perfil-identificacao__dados"><h2 id="perfil-identificacao-titulo">{usuario?.nome || ""}</h2><p>{usuario?.perfil || ""}</p></div>
          <div className="perfil-identificacao__acoes">
            <input ref={inputFotoRef} className="perfil-identificacao__arquivo" id="perfil-foto" type="file" accept="image/*" onChange={selecionarFoto} aria-label={textos.perfil.alterarFoto} />
            <Botao variante="secundario" onClick={() => inputFotoRef.current?.click()}>{textos.perfil.alterarFoto}</Botao>
            <Botao variante="terciario" onClick={removerFoto} desabilitado={!foto || removendoFoto}>{textos.perfil.removerFoto}</Botao>
          </div>
        </div>
        {mensagemFoto && <Alerta variante={tipoFoto}>{mensagemFoto}</Alerta>}

        <form className="perfil-grupo" onSubmit={salvarDados} noValidate aria-labelledby="perfil-pessoais-titulo">
          <div className="perfil-grupo__cabecalho"><h2 id="perfil-pessoais-titulo">{textos.perfil.informacoesPessoais}</h2></div>
          {mensagemDados && <Alerta variante={tipoDados}>{mensagemDados}</Alerta>}
          <div className="perfil-grupo__campos">
            <CampoTexto ref={nomeRef} id="perfil-nome" label={textos.perfil.nome} valor={dados.nome} onChange={(evento) => alterarDados("nome", evento.target.value)} erro={errosDados.nome} autoComplete="name" desabilitado={carregandoDados} required />
            <CampoTexto ref={emailRef} id="perfil-email" label={textos.perfil.email} tipo="email" valor={dados.email} onChange={(evento) => alterarDados("email", evento.target.value)} erro={errosDados.email} autoComplete="email" desabilitado={carregandoDados} required />
          </div>
          <div className="perfil-grupo__acoes"><Botao tipo="submit" carregando={carregandoDados} desabilitado={carregandoDados}>{textos.perfil.salvar}</Botao></div>
        </form>
        <form className="perfil-grupo" id="seguranca" ref={segurancaRef} onSubmit={salvarSenha} noValidate aria-labelledby="perfil-seguranca-titulo">
          <div className="perfil-grupo__cabecalho"><h2 id="perfil-seguranca-titulo">{textos.perfil.seguranca}</h2></div>
          {mensagemSenha && <Alerta variante={tipoSenha}>{mensagemSenha}</Alerta>}
          <div className="perfil-grupo__campos">
            <CampoTexto ref={senhaAtualRef} id="perfil-senha-atual" label={textos.perfil.senhaAtual} tipo="password" valor={senhas.atual} onChange={(evento) => alterarSenhas("atual", evento.target.value)} erro={errosSenha.atual} autoComplete="current-password" desabilitado={carregandoSenha} required />
            <CampoTexto ref={senhaNovaRef} id="perfil-senha-nova" label={textos.perfil.senhaNova} tipo="password" valor={senhas.nova} onChange={(evento) => alterarSenhas("nova", evento.target.value)} erro={errosSenha.nova} autoComplete="new-password" desabilitado={carregandoSenha} required />
            <CampoTexto ref={confirmarRef} id="perfil-confirmar-senha" label={textos.perfil.confirmarSenha} tipo="password" valor={senhas.confirmar} onChange={(evento) => alterarSenhas("confirmar", evento.target.value)} erro={errosSenha.confirmar} autoComplete="new-password" desabilitado={carregandoSenha} required />
          </div>
          <div className="perfil-grupo__acoes"><Botao tipo="submit" carregando={carregandoSenha} desabilitado={carregandoSenha}>{textos.perfil.salvar}</Botao></div>
        </form>
      </section>
    </div>

    {confirmarRemocao && <DialogoVenda titulo={textos.perfil.removerFotoTitulo} onFechar={() => { if (!removendoFoto) setConfirmarRemocao(false); }}>
      <p>{textos.perfil.removerFotoConfirmacao}</p>
      <div className="dialogo-venda__acoes"><Botao variante="secundario" onClick={() => setConfirmarRemocao(false)} desabilitado={removendoFoto}>{textos.perfil.cancelar}</Botao><Botao onClick={confirmarRemocaoFoto} carregando={removendoFoto} desabilitado={removendoFoto}>{textos.perfil.remover}</Botao></div>
    </DialogoVenda>}
  </section>;
}
