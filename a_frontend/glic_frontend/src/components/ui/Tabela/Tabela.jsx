import EstadoVazio from "../EstadoVazio/EstadoVazio";
import "./Tabela.css";
export default function Tabela({ colunas = [], linhas = [], chave = "id", vazio = "Nenhum registro encontrado.", carregando = false, caption }) {
  if (carregando) return <div className="ui-tabela__esqueleto" aria-label="Carregando" />;
  if (!linhas.length) return <EstadoVazio texto={vazio} />;
  return <div className="ui-tabela__rolagem"><table className="ui-tabela"><caption>{caption || vazio}</caption><thead><tr>{colunas.map((coluna) => <th key={coluna.chave} scope="col">{coluna.titulo}</th>)}</tr></thead><tbody>{linhas.map((linha, indice) => <tr key={linha[chave] ?? indice}>{colunas.map((coluna) => <td key={coluna.chave}>{coluna.render ? coluna.render(linha) : linha[coluna.chave]}</td>)}</tr>)}</tbody></table></div>;
}