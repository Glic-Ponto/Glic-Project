package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import school.sptech.glic.entity.Produto;

public class ProdutoResponseDto {

    @Schema(description = "Identificador do produto", example = "1")
    private Integer id;
    @Schema(description = "Nome do produto", example = "Central multimídia")
    private String nome;
    @Schema(description = "Categoria do produto", example = "Multimídia")
    private String categoria;
    @Schema(description = "Marca do produto", example = "Universal")
    private String marca;
    @Schema(description = "Fornecedor do produto", example = "Pioneer Distribuidora")
    private String fornecedor;
    @Schema(description = "Quantidade em estoque", example = "5")
    private Integer quantidade;
    @Schema(description = "Preço de venda", example = "890.0")
    private Double preco;
    @Schema(description = "Estoque mínimo antes de gerar alerta", example = "2")
    private Integer minimo;
    @Schema(description = "Unidade de medida", example = "un.")
    private String unidade;
    @Schema(description = "Imagem do produto em base64 (data URL)", example = "data:image/png;base64,iVBORw0KGgo...")
    private String imagem;

    public ProdutoResponseDto() {
    }

    public ProdutoResponseDto(Produto produto) {
        this.id = produto.getIdProduto();
        this.nome = produto.getNome();
        this.categoria = produto.getCategoria();
        this.marca = produto.getMarca();
        this.fornecedor = produto.getFornecedor();
        this.quantidade = produto.getQuantidadeEstoque();
        this.preco = produto.getPrecoVenda();
        this.minimo = produto.getEstoqueMinimo();
        this.unidade = produto.getUnidade();
        this.imagem = produto.getImagem();
    }

    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public String getCategoria() { return categoria; }
    public String getMarca() { return marca; }
    public String getFornecedor() { return fornecedor; }
    public Integer getQuantidade() { return quantidade; }
    public Double getPreco() { return preco; }
    public Integer getMinimo() { return minimo; }
    public String getUnidade() { return unidade; }
    public String getImagem() { return imagem; }
}
