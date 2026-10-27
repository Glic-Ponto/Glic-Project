package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class CategoriaValorDto {

    @Schema(description = "Nome da categoria", example = "Películas")
    private String nome;
    @Schema(description = "Valor faturado na categoria no período", example = "540.0")
    private Double valor;

    public CategoriaValorDto() {
    }

    public CategoriaValorDto(String nome, Double valor) {
        this.nome = nome;
        this.valor = valor;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }
}
