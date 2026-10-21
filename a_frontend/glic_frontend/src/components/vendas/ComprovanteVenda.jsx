import "./ComprovanteVenda.css";

const moeda = valor => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
}).format(Number(valor) || 0);

const dataHora = valor => new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Sao_Paulo"
}).format(new Date(valor));

const textoReal = valor => typeof valor === "string" && valor.trim() ? valor.trim() : null;
const subtotalItem = item => Number.isFinite(Number(item.total)) ? Number(item.total) : Number(item.preco) * Number(item.quantidade);

export function dadosComprovanteValidos(venda) {
  return Boolean(
    textoReal(venda?.id)
    && venda?.status !== "rascunho"
    && !Number.isNaN(new Date(venda?.data).getTime())
    && Number.isFinite(Number(venda?.total))
    && Array.isArray(venda?.itens)
    && venda.itens.length
    && venda.itens.every(item => textoReal(item?.nome)
      && Number.isSafeInteger(Number(item?.quantidade))
      && Number(item.quantidade) > 0
      && Number.isFinite(Number(item?.preco))
      && Number(item.preco) >= 0
      && Number.isFinite(subtotalItem(item)))
  );
}

export default function ComprovanteVenda({ venda }) {
  const itens = venda.itens;
  const subtotalCalculado = itens.reduce((soma, item) => soma + subtotalItem(item), 0);
  const subtotal = Number.isFinite(Number(venda.subtotal)) ? Number(venda.subtotal) : subtotalCalculado;
  const desconto = Number.isFinite(Number(venda.desconto)) ? Number(venda.desconto) : 0;
  const cliente = textoReal(venda.cliente);
  const responsavel = textoReal(venda.usuarioNome);
  const veiculo = textoReal(venda.veiculo);
  const pagamento = textoReal(venda.pagamento);

  return <article className="comprovante" aria-labelledby="comprovante-titulo">
    <header className="comprovante__cabecalho">
      <div className="comprovante__marca">
        <img src="/assets/logo-oficina-dsom.png" alt="Oficina DSom" />
        <div><p>Glic Project</p><h1 id="comprovante-titulo">Comprovante de venda</h1></div>
      </div>
      <strong className="comprovante__selo">Documento não fiscal</strong>
    </header>

    <section className="comprovante__metadados" aria-label="Informações da venda">
      <div><strong>Venda</strong><span className="comprovante__codigo">{venda.id}</span></div>
      <div><strong>Data da venda</strong><time dateTime={venda.data}>{dataHora(venda.data)}</time></div>
      {cliente && <div><strong>Comprador / Cliente</strong><span>{cliente}</span></div>}
      {responsavel && <div><strong>Responsável</strong><span>{responsavel}</span></div>}
      {veiculo && <div><strong>Veículo</strong><span>{veiculo}</span></div>}
      <div><strong>Status</strong><span>Finalizada</span></div>
    </section>

    <table className="comprovante__tabela">
      <caption>Produtos e serviços da venda</caption>
      <thead><tr><th scope="col">Produto</th><th scope="col">Qtd.</th><th scope="col">Valor unitário</th><th scope="col">Subtotal</th></tr></thead>
      <tbody>{itens.map((item, indice) => {
        const detalhes = [item.configuracao?.servico, item.configuracao?.tipoVeiculo, item.configuracao?.area].filter(Boolean);
        return <tr key={item.id || `${item.produtoId || "item"}-${indice}`}>
          <td><strong>{item.nome}</strong>{detalhes.length > 0 && <small>{detalhes.join(" · ")}</small>}</td>
          <td data-label="Qtd.">{item.quantidade}</td>
          <td data-label="Valor unitário">{moeda(item.preco)}</td>
          <td data-label="Subtotal">{moeda(subtotalItem(item))}</td>
        </tr>;
      })}</tbody>
    </table>

    <section className="comprovante__totais" aria-label="Totais da venda">
      <p><span>Subtotal dos produtos</span><span>{moeda(subtotal)}</span></p>
      {desconto > 0 && <p><span>Desconto</span><span>− {moeda(desconto)}</span></p>}
      <p className="comprovante__total"><strong>Total da venda</strong><strong>{moeda(venda.total)}</strong></p>
    </section>

    <section className="comprovante__pagamento" aria-labelledby="comprovante-pagamento">
      <h2 id="comprovante-pagamento">Forma de pagamento</h2>
      <p>{pagamento || "Não informada no registro da venda"}</p>
    </section>

    <footer className="comprovante__rodape">
      <strong>Documento não fiscal</strong>
      <p>Este documento é um comprovante não fiscal referente à venda registrada no sistema. Não substitui nota fiscal ou documento fiscal legalmente exigido.</p>
    </footer>
  </article>;
}
