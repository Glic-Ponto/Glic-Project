import { useState } from "react";
import "./Avatar.css";
export default function Avatar({ nome = "", src, tamanho = "pequeno", carregando = false }) {
  const [falhou, setFalhou] = useState(false);
  const iniciais = nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase() || "?";
  if (carregando) return <span className={`ui-avatar ui-avatar--${tamanho} ui-avatar--esqueleto`} aria-label="Carregando avatar" />;
  return <span className={`ui-avatar ui-avatar--${tamanho}`}>{src && !falhou ? <img src={src} alt={`Foto de ${nome}`} onError={() => setFalhou(true)} /> : <span aria-label={nome ? `Iniciais de ${nome}` : "Avatar"}>{iniciais}</span>}</span>;
}