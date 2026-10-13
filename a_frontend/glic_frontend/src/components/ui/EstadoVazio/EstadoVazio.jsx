import { Inbox } from "lucide-react";
import "./EstadoVazio.css";
export default function EstadoVazio({ texto, icone, children }) {
  return <div className="ui-estado-vazio">{icone || <Inbox aria-hidden="true" size={28} />}<p>{texto || children}</p></div>;
}