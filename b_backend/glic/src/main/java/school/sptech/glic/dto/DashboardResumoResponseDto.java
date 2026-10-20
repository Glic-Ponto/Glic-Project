package school.sptech.glic.dto;

import java.util.List;

public class DashboardResumoResponseDto {

    private IntervaloDashboardDto intervalo;
    private Double faturamento;
    private Integer vendas;
    private Double ticketMedio;
    private Double descontos;
    private Double receitas;
    private Double despesas;
    private Double resultado;
    private List<PontoGraficoDto> faturamentoPorDia;
    private List<CategoriaValorDto> faturamentoPorCategoria;
    private List<ServicoRankingDto> servicosMaisVendidos;

    public DashboardResumoResponseDto() {
    }

    public IntervaloDashboardDto getIntervalo() {
        return intervalo;
    }

    public void setIntervalo(IntervaloDashboardDto intervalo) {
        this.intervalo = intervalo;
    }

    public Double getFaturamento() {
        return faturamento;
    }

    public void setFaturamento(Double faturamento) {
        this.faturamento = faturamento;
    }

    public Integer getVendas() {
        return vendas;
    }

    public void setVendas(Integer vendas) {
        this.vendas = vendas;
    }

    public Double getTicketMedio() {
        return ticketMedio;
    }

    public void setTicketMedio(Double ticketMedio) {
        this.ticketMedio = ticketMedio;
    }

    public Double getDescontos() {
        return descontos;
    }

    public void setDescontos(Double descontos) {
        this.descontos = descontos;
    }

    public Double getReceitas() {
        return receitas;
    }

    public void setReceitas(Double receitas) {
        this.receitas = receitas;
    }

    public Double getDespesas() {
        return despesas;
    }

    public void setDespesas(Double despesas) {
        this.despesas = despesas;
    }

    public Double getResultado() {
        return resultado;
    }

    public void setResultado(Double resultado) {
        this.resultado = resultado;
    }

    public List<PontoGraficoDto> getFaturamentoPorDia() {
        return faturamentoPorDia;
    }

    public void setFaturamentoPorDia(List<PontoGraficoDto> faturamentoPorDia) {
        this.faturamentoPorDia = faturamentoPorDia;
    }

    public List<CategoriaValorDto> getFaturamentoPorCategoria() {
        return faturamentoPorCategoria;
    }

    public void setFaturamentoPorCategoria(List<CategoriaValorDto> faturamentoPorCategoria) {
        this.faturamentoPorCategoria = faturamentoPorCategoria;
    }

    public List<ServicoRankingDto> getServicosMaisVendidos() {
        return servicosMaisVendidos;
    }

    public void setServicosMaisVendidos(List<ServicoRankingDto> servicosMaisVendidos) {
        this.servicosMaisVendidos = servicosMaisVendidos;
    }
}
