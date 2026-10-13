import { Package } from "lucide-react";
import EstadoVazio from "../EstadoVazio/EstadoVazio";
import "./ListaItens.css";
export default function ListaItens({ itens = [], renderItem, carregando = false, vazio = "Nenhum item encontrado." }) {
  if (carregando) return <div className="ui-lista-itens__esqueleto" aria-label="Carregando" />;
  if (!itens.length) return <EstadoVazio icone={<Package aria-hidden="true" />} texto={vazio} />;
  return <ul className="ui-lista-itens">{itens.map((item, indice) => <li key={item.id ?? indice}>{renderItem ? renderItem(item) : <span>{item.nome ?? String(item)}</span>}</li>)}</ul>;
}