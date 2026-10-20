package school.sptech.glic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Integer idProduto;

    @NotBlank
    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "descricao", length = 200)
    private String descricao;

    @NotBlank
    @Column(name = "categoria", length = 100, nullable = false)
    private String categoria;

    @NotNull
    @PositiveOrZero
    @Column(name = "preco_venda", nullable = false)
    private Double precoVenda;

    @NotNull
    @PositiveOrZero
    @Column(name = "quantidade_estoque", nullable = false)
    private Integer quantidadeEstoque;

    @NotNull
    @PositiveOrZero
    @Column(name = "estoque_minimo", nullable = false)
    private Integer estoqueMinimo;

    @NotNull
    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    public Produto() {
    }

    public Produto(
            String nome,
            String descricao,
            String categoria,
            Double precoVenda,
            Integer quantidadeEstoque,
            Integer estoqueMinimo,
            Boolean ativo
    ) {
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.precoVenda = precoVenda;
        this.quantidadeEstoque = quantidadeEstoque;
        this.estoqueMinimo = estoqueMinimo;
        this.ativo = ativo;
    }

    public Integer getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Integer idProduto) {
        this.idProduto = idProduto;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Double getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(Double precoVenda) {
        this.precoVenda = precoVenda;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public Integer getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(Integer estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
