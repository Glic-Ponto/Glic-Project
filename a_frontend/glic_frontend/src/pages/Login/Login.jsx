/* TL01: painel escuro ocupa cerca de 32% da largura e traz o placeholder IMG centralizado. À direita, o título fica próximo ao topo, seguido pelos campos E-mail e Senha empilhados. O botão Entrar fica centralizado perto da base do painel de formulário. */
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { rotas } from "../../constants/rotas";
import { textos } from "../../constants/textos";
import CampoTexto from "../../components/ui/CampoTexto/CampoTexto";
import Botao from "../../components/ui/Botao/Botao";
import Alerta from "../../components/ui/Alerta/Alerta";
import "./Login.css";

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [erroAutenticacao, setErroAutenticacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  async function enviar(evento) {
    evento.preventDefault();
    const novosErros = {};
    if (!email.trim()) novosErros.email = textos.comuns.campoObrigatorio;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novosErros.email = textos.comuns.emailInvalido;
    if (!senha) novosErros.senha = textos.comuns.campoObrigatorio;
    setErros(novosErros);
    setErroAutenticacao("");
    if (Object.keys(novosErros).length) {
      (novosErros.email ? emailRef : senhaRef).current?.focus();
      return;
    }
    setCarregando(true);
    try {
      await entrar(email, senha);
      navigate(rotas.dashboard, { replace: true });
    } catch (erro) {
      setErroAutenticacao(erro.message || textos.login.erroAutenticacao);
    } finally {
      setCarregando(false);
    }
  }

  return <section className="pagina-login" aria-labelledby="login-titulo">
    <h1 id="login-titulo">{textos.login.titulo}</h1>
    <form className="pagina-login__formulario" onSubmit={enviar} noValidate>
      {erroAutenticacao && <Alerta variante="erro">{erroAutenticacao}</Alerta>}
      <CampoTexto ref={emailRef} id="login-email" label={textos.login.email} tipo="email" valor={email} onChange={(evento) => setEmail(evento.target.value)} erro={erros.email} autoComplete="username" desabilitado={carregando} required />
      <CampoTexto ref={senhaRef} id="login-senha" label={textos.login.senha} tipo="password" valor={senha} onChange={(evento) => setSenha(evento.target.value)} erro={erros.senha} autoComplete="current-password" desabilitado={carregando} required />
      <div className="pagina-login__acao"><Botao tipo="submit" tamanho="grande" desabilitado={carregando} carregando={carregando}>{textos.login.entrar}</Botao><p className="pagina-login__cadastro">Não possui conta? <Link to={rotas.cadastro}>Cadastre-se agora</Link></p></div>
    </form>
  </section>;
}
