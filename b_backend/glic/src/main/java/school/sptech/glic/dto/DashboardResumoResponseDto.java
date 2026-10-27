package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public class DashboardResumoResponseDto {

    @Schema(description = "Intervalo de datas considerado no resumo")
    private IntervaloDashboardDto intervalo;
    @Schema(description = "Soma do valor total das vendas no período", example = "1590.0")
    private Double faturamento;
    @Schema(description = "Quantidade de vendas no período", example = "2")
    private Integer vendas;
    @Schema(description = "Valor médio por venda no período", example = "795.0")
    private Double ticketMedio;
    @Schema(description = "Soma dos descontos concedidos no período", example = "50.0")
    private Double descontos;
    @Schema(description = "Total de receitas no período", example = "1590.0")
    private Double receitas;
    @Schema(description = "Total de despesas no período", example = "320.0")
    private Double despesas;
    @Schema(description = "Resultado do período (receitas menos despesas)", example = "1270.0")
    private Double resultado;
    @ArraySchema(schema = @Schema(description = "Ponto do gráfico de faturamento (por dia, ou por hora quando o período é de um único dia)"))
    private List<PontoGraficoDto> faturamentoPorDia;
    @ArraySchema(schema = @Schema(description = "Faturamento de uma categoria no período"))
    private List<CategoriaValorDto> faturamentoPorCategoria;
    @ArraySchema(schema = @Schema(description = "Serviço do ranking dos mais vendidos (até 5 itens)"))
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
