import { requisicao } from "./api";

const inicioDia = (data) => new Date(data.getFullYear(), data.getMonth(), data.getDate());
const fimDia = (data) => new Date(data.getFullYear(), data.getMonth(), data.getDate(), 23, 59, 59, 999);
const dataChave = (data) => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
const dataLocal = (valor) => {
  const [ano, mes, dia] = (valor || "").split("-").map(Number);
  return Number.isInteger(ano) && Number.isInteger(mes) && Number.isInteger(dia) ? new Date(ano, mes - 1, dia) : null;
};

export function obterIntervaloDashboard(periodo, personalizado, agora = new Date()) {
  if (periodo === "personalizado") {
    const inicio = dataLocal(personalizado?.inicio);
    const fim = dataLocal(personalizado?.fim);
    if (!inicio || !fim || fim < inicio) throw new Error("Informe um período personalizado válido.");
    return { inicio: inicioDia(inicio), fim: fimDia(fim), porHora: dataChave(inicio) === dataChave(fim) };
  }
  const dias = periodo === "30dias" ? 30 : periodo === "7dias" ? 7 : 1;
  const inicio = inicioDia(agora);
  inicio.setDate(inicio.getDate() - (dias - 1));
  return { inicio, fim: fimDia(agora), porHora: dias === 1 };
}

export async function obterResumoDashboard(periodo = "hoje", personalizado) {
  const params = new URLSearchParams({ periodo });
  if (periodo === "personalizado") {
    if (!personalizado?.inicio || !personalizado?.fim || personalizado.fim < personalizado.inicio) {
      throw new Error("Informe um período personalizado válido.");
    }
    params.set("inicio", personalizado.inicio);
    params.set("fim", personalizado.fim);
  }
  return requisicao(`/dashboard/resumo?${params.toString()}`);
}
