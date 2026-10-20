package school.sptech.glic.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

@Entity
@Table(name = "item_venda")
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item_venda")
    private Integer idItemVenda;

    @ManyToOne
    @JoinColumn(name = "id_venda", nullable = false)
    @JsonBackReference
    private Venda venda;

    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @NotNull
    @Positive
    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @NotNull
    @PositiveOrZero
    @Column(name = "preco_unitario", nullable = false)
    private Double precoUnitario;

    @NotNull
    @PositiveOrZero
    @Column(name = "desconto", nullable = false)
    private Double desconto;

    @NotNull
    @PositiveOrZero
    @Column(name = "subtotal", nullable = false)
    private Double subtotal;

    public ItemVenda() {
    }

    public Integer getIdItemVenda() {
        return idItemVenda;
    }

    public void setIdItemVenda(Integer idItemVenda) {
        this.idItemVenda = idItemVenda;
    }

    public Venda getVenda() {
        return venda;
    }

    public void setVenda(Venda venda) {
        this.venda = venda;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
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

    public Double getDesconto() {
        return desconto;
    }

    public void setDesconto(Double desconto) {
        this.desconto = desconto;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}
