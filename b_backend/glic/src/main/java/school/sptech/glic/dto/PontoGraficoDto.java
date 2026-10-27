package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class PontoGraficoDto {

    @Schema(description = "Rótulo curto do eixo do gráfico (dd/MM, ou HH:00 quando agrupado por hora)", example = "27/10")
    private String nome;
    @Schema(description = "Rótulo completo do ponto para exibição", example = "terça-feira, 27 de outubro de 2026")
    private String rotuloCompleto;
    @Schema(description = "Faturamento no ponto", example = "890.0")
    private Double valor;
    @Schema(description = "Data do ponto no formato yyyy-MM-dd", example = "2026-10-27")
    private String chave;

    public PontoGraficoDto() {
    }

    public PontoGraficoDto(String nome, String rotuloCompleto, Double valor, String chave) {
        this.nome = nome;
        this.rotuloCompleto = rotuloCompleto;
        this.valor = valor;
        this.chave = chave;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getRotuloCompleto() {
        return rotuloCompleto;
    }

    public void setRotuloCompleto(String rotuloCompleto) {
        this.rotuloCompleto = rotuloCompleto;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getChave() {
        return chave;
    }

    public void setChave(String chave) {
        this.chave = chave;
    }
}
