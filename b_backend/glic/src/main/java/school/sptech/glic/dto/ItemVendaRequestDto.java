package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public class ItemVendaRequestDto {

    @Schema(description = "Identificador do produto no front-end. Atualmente não é usado; o produto é localizado pelo nome", example = "1")
    private String produtoId;

    @Schema(description = "Nome do produto. Se não existir, é cadastrado automaticamente", example = "Película automotiva")
    @NotBlank(message = "O nome do item é obrigatório")
    private String nome;

    @Schema(description = "Categoria do produto", example = "Películas")
    @NotBlank(message = "A categoria do item é obrigatória")
    private String categoria;

    @Schema(description = "Descrição do serviço. Usada como descrição ao cadastrar um produto novo", example = "Instalação de insulfilm")
    private String servico;
    @Schema(description = "Tipo de veículo. Atualmente não é gravado pelo back-end", example = "Carro")
    private String tipoVeiculo;
    @Schema(description = "Área de aplicação. Atualmente não é gravada pelo back-end", example = "Vidros laterais")
    private String area;

    @Schema(description = "Quantidade vendida", example = "2")
    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    private Integer quantidade;

    @Schema(description = "Preço unitário", example = "180.0")
    @NotNull(message = "O preço é obrigatório")
    @PositiveOrZero(message = "O preço não pode ser negativo")
    private Double preco;

    public ItemVendaRequestDto() {
    }

    public String getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(String produtoId) {
        this.produtoId = produtoId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getServico() {
        return servico;
    }

    public void setServico(String servico) {
        this.servico = servico;
    }

    public String getTipoVeiculo() {
        return tipoVeiculo;
    }

    public void setTipoVeiculo(String tipoVeiculo) {
        this.tipoVeiculo = tipoVeiculo;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }
}
