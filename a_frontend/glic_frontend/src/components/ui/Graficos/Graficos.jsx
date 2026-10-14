import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Cartao from "../Cartao/Cartao";
import "./Graficos.css";

export default function Graficos({ titulo, descricao, dados = [], tipo = "linha", chaveX = "nome", chaveY = "valor", formatarValor = (v) => v }) {
  const tick = { fill: "var(--cor-texto-secundario)", fontSize: 12 };
  return <Cartao titulo={titulo} className="ui-graficos">
    <p className="ui-graficos__descricao">{descricao}</p>
    <div className="ui-graficos__area">
      <ResponsiveContainer width="100%" height="100%">
        {tipo === "barra" ?
          <BarChart data={dados} layout="vertical" margin={{ top: 4, right: 76, bottom: 4, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey={chaveX} tick={tick} width={92} tickLine={false} axisLine={false} />
            <Tooltip formatter={(valor) => formatarValor(valor)} />
            <Bar dataKey={chaveY} fill="var(--cor-secundaria)" barSize={14}>
              <LabelList dataKey={chaveY} position="right" formatter={formatarValor} style={tick} />
            </Bar>
          </BarChart> :
          <LineChart data={dados} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--cor-borda)" vertical={false} />
            <XAxis dataKey={chaveX} tick={tick} tickLine={false} minTickGap={16} />
            <YAxis tick={tick} tickLine={false} axisLine={false} width={44} />
            <Tooltip formatter={(valor) => formatarValor(valor)} />
            <Line dataKey={chaveY} stroke="var(--cor-secundaria)" strokeWidth={2} dot={false} activeDot={{ fill: "var(--cor-primaria)", r: 4 }} />
          </LineChart>}
      </ResponsiveContainer>
    </div>
    <details className="ui-graficos__dados">
      <summary>Consultar dados em tabela</summary>
      <table>
        <caption>{titulo}: dados equivalentes ao gráfico</caption>
        <thead><tr><th scope="col">{chaveX}</th><th scope="col">{chaveY}</th></tr></thead>
        <tbody>{dados.map((item, i) => <tr key={`${item[chaveX]}-${i}`}><td>{item[chaveX]}</td><td>{formatarValor(item[chaveY])}</td></tr>)}</tbody>
      </table>
    </details>
  </Cartao>;
}
