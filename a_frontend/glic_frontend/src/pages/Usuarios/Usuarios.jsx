/* TL07: listagem administrativa. Cadastro e edição serão ativados com a API. */
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, UsersRound } from "lucide-react";
import { listarUsuarios } from "../../services/usuariosService";
import Botao from "../../components/ui/Botao/Botao";
import Tabela from "../../components/ui/Tabela/Tabela";
import Alerta from "../../components/ui/Alerta/Alerta";
import "./Usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  useEffect(() => {
    let ativo = true;
    listarUsuarios().then((dados) => { if (ativo) setUsuarios(dados); }).catch(() => { if (ativo) setErro("Não foi possível carregar os usuários."); }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);
  const filtrados = useMemo(() => usuarios.filter((usuario) => `${usuario.nome} ${usuario.email} ${usuario.perfil}`.toLocaleLowerCase("pt-BR").includes(busca.trim().toLocaleLowerCase("pt-BR"))), [usuarios, busca]);
  const colunas = [
    { chave: "nome", titulo: "Nome" }, { chave: "email", titulo: "E-mail" }, { chave: "perfil", titulo: "Perfil" },
    { chave: "ativo", titulo: "Status", render: usuario => <span className={`usuarios__status ${usuario.ativo === false ? "usuarios__status--inativo" : ""}`}><span aria-hidden="true" />{usuario.ativo === false ? "Inativo" : "Ativo"}</span> },
    { chave: "editar", titulo: "Ação", render: () => <button className="usuarios__editar" type="button" disabled title="Edição será disponibilizada em breve">Editar</button> }
  ];
  return <section className="pagina-usuarios" aria-labelledby="titulo-pagina">
    <header className="usuarios__cabecalho"><h1 id="titulo-pagina">Usuários</h1><Botao desabilitado title="Cadastro de usuários será disponibilizado em breve"><Plus size={16} aria-hidden="true" />Cadastrar usuário</Botao></header>
    {erro && <Alerta variante="erro">{erro}</Alerta>}
    <div className="usuarios__barra"><label><Search aria-hidden="true" /><span className="usuarios__sr-only">Buscar usuário</span><input value={busca} onChange={evento => setBusca(evento.target.value)} placeholder="Buscar por nome, e-mail ou perfil" /></label><span><UsersRound size={18} aria-hidden="true" />{usuarios.length} usuário(s)</span></div>
    <Tabela colunas={colunas} linhas={filtrados} carregando={carregando} vazio="Nenhum usuário encontrado." caption="Usuários cadastrados" />
  </section>;
}
