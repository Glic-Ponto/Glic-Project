package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import school.sptech.glic.entity.ItemVenda;

public class ItemVendaResponseDto {

    @Schema(description = "Identificador do item da venda", example = "1")
    private Integer id;

    @Schema(description = "Identificador do produto vendido", example = "1")
    private Integer produtoId;

    @Schema(description = "Nome do produto vendido", example = "Película automotiva")
    private String produtoNome;

    @Schema(description = "Quantidade vendida", example = "2")
    private Integer quantidade;

    @Schema(description = "Preço unitário no momento da venda", example = "180.0")
    private Double precoUnitario;

    @Schema(description = "Desconto aplicado ao item", example = "0.0")
    private Double desconto;

    @Schema(description = "Subtotal do item (preço unitário x quantidade)", example = "360.0")
    private Double subtotal;

    public ItemVendaResponseDto() {
    }

    public ItemVendaResponseDto(ItemVenda item) {
        this.id = item.getIdItemVenda();
        this.produtoId = item.getProduto() != null ? item.getProduto().getIdProduto() : null;
        this.produtoNome = item.getProduto() != null ? item.getProduto().getNome() : null;
        this.quantidade = item.getQuantidade();
        this.precoUnitario = item.getPrecoUnitario();
        this.desconto = item.getDesconto();
        this.subtotal = item.getSubtotal();
    }

    public Integer getId() { return id; }
    public Integer getProdutoId() { return produtoId; }
    public String getProdutoNome() { return produtoNome; }
    public Integer getQuantidade() { return quantidade; }
    public Double getPrecoUnitario() { return precoUnitario; }
    public Double getDesconto() { return desconto; }
    public Double getSubtotal() { return subtotal; }
}
