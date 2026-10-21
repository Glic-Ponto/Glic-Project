package school.sptech.glic.dto;

import school.sptech.glic.entity.Produto;

public class ProdutoResponseDto {

    private Integer id;
    private String nome;
    private String categoria;
    private String marca;
    private String fornecedor;
    private Integer quantidade;
    private Double preco;
    private Integer minimo;
    private String unidade;
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
