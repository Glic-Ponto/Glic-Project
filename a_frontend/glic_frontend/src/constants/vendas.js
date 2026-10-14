export const tiposServico = ["Instalação de insulfilm", "Instalação de multimídia", "Instalação de acessórios"];
export const tiposVeiculo = ["Tipo A", "Tipo B"];
export const areasAplicacao = ["Área A", "Área B", "Área C"];
// Registros anteriores à introdução de rascunhos já eram vendas concluídas.
export const statusVenda = (venda) => venda.status || "finalizada";
export const configuracaoVazia = () => ({ servico: "", tipoVeiculo: "", area: "" });
