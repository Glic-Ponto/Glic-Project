/* TL08: painel escuro de imagem ocupa cerca de 32% da largura e contém IMG centralizado. No painel claro, o título Cadastro fica próximo ao topo e quatro campos aparecem empilhados em ordem. O botão Criar conta fica centralizado próximo à base; não há campo de perfil no wireframe. */
import { useRef, useState } from "react";
import { textos } from "../../constants/textos";
import { useAuth } from "../../contexts/AuthContext";
import CampoTexto from "../../components/ui/CampoTexto/CampoTexto";
import Botao from "../../components/ui/Botao/Botao";
import Alerta from "../../components/ui/Alerta/Alerta";
import "./Cadastro.css";

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const [dados, setDados] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("sucesso");
  const [carregando, setCarregando] = useState(false);
  const refs = { nome: useRef(null), email: useRef(null), senha: useRef(null), confirmarSenha: useRef(null) };

  function alterar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: "" }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setMensagem("");
    const novosErros = {};
    if (!dados.nome.trim()) novosErros.nome = textos.comuns.campoObrigatorio;
    if (!dados.email.trim()) novosErros.email = textos.comuns.campoObrigatorio;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) novosErros.email = textos.comuns.emailInvalido;
    if (!dados.senha) novosErros.senha = textos.comuns.campoObrigatorio;
    if (!dados.confirmarSenha) novosErros.confirmarSenha = textos.comuns.campoObrigatorio;
    if (dados.senha && dados.confirmarSenha && dados.senha !== dados.confirmarSenha) novosErros.confirmarSenha = textos.cadastro.erroSenha;
    setErros(novosErros);
    const primeiroErro = Object.keys(novosErros)[0];
    if (primeiroErro) {
      refs[primeiroErro].current?.focus();
      if (dados.senha && dados.confirmarSenha && dados.senha !== dados.confirmarSenha) {
        setTipoMensagem("erro");
        setMensagem(textos.cadastro.erroSenha);
      }
      return;
    }
    setCarregando(true);
    try {
      await cadastrar({ nome: dados.nome, email: dados.email, senha: dados.senha });
      setTipoMensagem("sucesso");
      setMensagem(textos.cadastro.sucesso);
      setDados({ nome: "", email: "", senha: "", confirmarSenha: "" });
    } catch (erro) {
      setTipoMensagem("erro");
      setMensagem(erro.message || textos.comuns.erroConexao);
    } finally {
      setCarregando(false);
    }
  }

  return <section className="pagina-cadastro" aria-labelledby="cadastro-titulo">
    <h1 id="cadastro-titulo">{textos.cadastro.titulo}</h1>
    <form className="pagina-cadastro__formulario" onSubmit={enviar} noValidate>
      {mensagem && <Alerta variante={tipoMensagem}>{mensagem}</Alerta>}
      <CampoTexto ref={refs.nome} id="cadastro-nome" label={textos.cadastro.nome} valor={dados.nome} onChange={(evento) => alterar("nome", evento.target.value)} erro={erros.nome} autoComplete="name" desabilitado={carregando} required />
      <CampoTexto ref={refs.email} id="cadastro-email" label={textos.cadastro.email} tipo="email" valor={dados.email} onChange={(evento) => alterar("email", evento.target.value)} erro={erros.email} autoComplete="email" desabilitado={carregando} required />
      <CampoTexto ref={refs.senha} id="cadastro-senha" label={textos.cadastro.senha} tipo="password" valor={dados.senha} onChange={(evento) => alterar("senha", evento.target.value)} erro={erros.senha} autoComplete="new-password" desabilitado={carregando} required />
      <CampoTexto ref={refs.confirmarSenha} id="cadastro-confirmar-senha" label={textos.cadastro.confirmarSenha} tipo="password" valor={dados.confirmarSenha} onChange={(evento) => alterar("confirmarSenha", evento.target.value)} erro={erros.confirmarSenha} autoComplete="new-password" desabilitado={carregando} required />
      <Botao tipo="submit" tamanho="grande" carregando={carregando} desabilitado={carregando}>{textos.cadastro.criarConta}</Botao>
    </form>
  </section>;
}
