import { useEffect, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { rotas } from "../../constants/rotas";
import { statusVenda } from "../../constants/vendas";
import { obterVenda } from "../../services/vendasService";
import Alerta from "../../components/ui/Alerta/Alerta";
import Botao from "../../components/ui/Botao/Botao";
import ComprovanteVenda, { dadosComprovanteValidos } from "../../components/vendas/ComprovanteVenda";
import "./ComprovanteVendaPage.css";

export default function ComprovanteVendaPage() {
  const { id } = useParams();
  const location = useLocation();
  const [venda, setVenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const pronta = Boolean(venda && dadosComprovanteValidos(venda));

  useEffect(() => {
    let ativo = true;
    setVenda(null);
    setErro("");
    setCarregando(true);
    obterVenda(id).then(resultado => {
      if (!ativo) return;
      if (statusVenda(resultado) !== "finalizada") {
        setErro("O comprovante está disponível somente para vendas finalizadas.");
        return;
      }
      if (!dadosComprovanteValidos(resultado)) {
        setErro("Os dados históricos desta venda estão incompletos. O comprovante não pode ser impresso com segurança.");
        return;
      }
      setVenda(resultado);
    }).catch(erroConsulta => {
      if (!ativo) return;
      setErro(erroConsulta.codigo === "VENDA_NAO_ENCONTRADA"
        ? "Venda não encontrada. Ela pode não existir mais nesta sessão."
        : "Não foi possível carregar o comprovante. Tente novamente.");
    }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [id, tentativa]);

  function imprimir() {
    if (pronta && !carregando) window.print();
  }

  return <main className={`pagina-comprovante${pronta ? " pagina-comprovante--pronta" : ""}`}>
    <div className="pagina-comprovante__acoes" aria-label="Ações do comprovante">
      <Link className="pagina-comprovante__voltar" to={rotas.vendas} state={{ contextoVendas: location.state?.origemVendas }}><ArrowLeft size={17} aria-hidden="true" />Voltar para vendas</Link>
      {pronta && <Botao onClick={imprimir}><Printer size={17} aria-hidden="true" />Imprimir comprovante</Botao>}
    </div>
    {carregando && <p className="pagina-comprovante__estado" role="status">Carregando comprovante…</p>}
    {!carregando && erro && <div className="pagina-comprovante__erro"><Alerta variante="erro" titulo="Comprovante indisponível">{erro}</Alerta><Botao variante="terciario" onClick={() => setTentativa(valor => valor + 1)}>Tentar novamente</Botao></div>}
    {pronta && <ComprovanteVenda venda={venda} />}
  </main>;
}
