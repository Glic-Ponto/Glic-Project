package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class ServicoRankingDto {

    @Schema(description = "Identificador do item no ranking", example = "Instalação de multimídia-0")
    private String id;
    @Schema(description = "Nome do serviço", example = "Instalação de multimídia")
    private String nome;
    @Schema(description = "Quantidade vendida no período", example = "3")
    private Integer quantidade;

    public ServicoRankingDto() {
    }

    public ServicoRankingDto(String id, String nome, Integer quantidade) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}
