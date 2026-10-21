package school.sptech.glic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class ProdutoRequestDto {

    @NotBlank(message = "O nome do produto é obrigatório")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    private String nome;

    @NotBlank(message = "A categoria é obrigatória")
    @Size(max = 100, message = "A categoria deve ter no máximo 100 caracteres")
    private String categoria;

    @NotBlank(message = "A marca é obrigatória")
    @Size(max = 80, message = "A marca deve ter no máximo 80 caracteres")
    private String marca;

    @Size(max = 100, message = "O fornecedor deve ter no máximo 100 caracteres")
    private String fornecedor;

    @NotNull(message = "A quantidade é obrigatória")
    @PositiveOrZero(message = "A quantidade não pode ser negativa")
    private Integer quantidade;

    @NotNull(message = "O preço é obrigatório")
    @PositiveOrZero(message = "O preço não pode ser negativo")
    private Double preco;

    @NotNull(message = "O estoque mínimo é obrigatório")
    @PositiveOrZero(message = "O estoque mínimo não pode ser negativo")
    private Integer minimo;

    @NotBlank(message = "A unidade de medida é obrigatória")
    @Size(max = 20, message = "A unidade deve ter no máximo 20 caracteres")
    private String unidade;

    private String imagem;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getFornecedor() { return fornecedor; }
    public void setFornecedor(String fornecedor) { this.fornecedor = fornecedor; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }
    public Integer getMinimo() { return minimo; }
    public void setMinimo(Integer minimo) { this.minimo = minimo; }
    public String getUnidade() { return unidade; }
    public void setUnidade(String unidade) { this.unidade = unidade; }
    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
}
