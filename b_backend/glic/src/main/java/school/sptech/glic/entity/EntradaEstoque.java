package school.sptech.glic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

@Entity
@Table(name = "entrada_estoque")
public class EntradaEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entrada")
    private Integer idEntrada;

    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @NotNull
    @Column(name = "data_entrada", nullable = false)
    private LocalDateTime dataEntrada;

    @NotNull
    @Positive
    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @NotNull
    @PositiveOrZero
    @Column(name = "preco_unitario", nullable = false)
    private Double precoUnitario;

    @Column(name = "fornecedor", length = 100)
    private String fornecedor;

    @Column(name = "observacao", length = 200)
    private String observacao;

    public EntradaEstoque() {
    }

    public EntradaEstoque(
            Produto produto,
            LocalDateTime dataEntrada,
            Integer quantidade,
            Double precoUnitario,
            String fornecedor,
            String observacao
    ) {
        this.produto = produto;
        this.dataEntrada = dataEntrada;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        this.fornecedor = fornecedor;
        this.observacao = observacao;
    }

    public Integer getIdEntrada() {
        return idEntrada;
    }

    public void setIdEntrada(Integer idEntrada) {
        this.idEntrada = idEntrada;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public LocalDateTime getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDateTime dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getPrecoUnitario() {
        return precoUnitario;
    }

    public void setPrecoUnitario(Double precoUnitario) {
        this.precoUnitario = precoUnitario;
    }

    public String getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
