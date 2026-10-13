// MOCK: substituir pela API REST
export const dashboardMock = {
  faturamento: 0,
  vendas: 0,
  ticketMedio: 0,
  descontos: 0,
  despesas: 0,
  faturamentoPorDia: [
    { nome: "Seg", valor: 0 }, { nome: "Ter", valor: 0 }, { nome: "Qua", valor: 0 },
    { nome: "Qui", valor: 0 }, { nome: "Sex", valor: 0 }, { nome: "Sáb", valor: 0 }, { nome: "Dom", valor: 0 }
  ],
  faturamentoPorCategoria: [
    { nome: "Películas", valor: 0 }, { nome: "Multimídia", valor: 0 }, { nome: "Acessórios", valor: 0 }
  ],
  servicosMaisVendidos: [
    { id: "srv-1", nome: "Aplicação de película", quantidade: 0 },
    { id: "srv-2", nome: "Instalação de multimídia", quantidade: 0 },
    { id: "srv-3", nome: "Câmera de ré", quantidade: 0 },
    { id: "srv-4", nome: "Sensor de estacionamento", quantidade: 0 },
    { id: "srv-5", nome: "Acessórios automotivos", quantidade: 0 }
  ]
};
