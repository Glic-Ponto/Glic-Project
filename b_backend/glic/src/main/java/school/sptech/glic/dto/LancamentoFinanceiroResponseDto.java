package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public class LancamentoFinanceiroResponseDto {

    @Schema(description = "Identificador do lançamento", example = "1")
    private Integer id;
    @Schema(description = "Descrição do lançamento", example = "Conta de energia elétrica da oficina")
    private String descricao;
    @Schema(description = "Categoria do lançamento", example = "Infraestrutura")
    private String categoria;
    @Schema(description = "Valor do lançamento", example = "450.0")
    private Double valor;
    @Schema(description = "Data e hora do lançamento", example = "2026-10-27T09:00:00")
    private LocalDateTime data;
    @Schema(description = "Tipo do lançamento: RECEITA ou DESPESA", example = "DESPESA")
    private String tipo;
    @Schema(description = "Forma de pagamento: DINHEIRO, CARTAO, PIX ou TRANSFERENCIA", example = "PIX")
    private String formaPagamento;
    @Schema(description = "Fornecedor da despesa (nulo para receitas)", example = "Enel SP")
    private String fornecedor;
    @Schema(description = "Status do lançamento: PENDENTE ou PAGA", example = "PAGA")
    private String status;

    public LancamentoFinanceiroResponseDto() {
    }

    public LancamentoFinanceiroResponseDto(
            Integer id,
            String descricao,
            String categoria,
            Double valor,
            LocalDateTime data,
            String tipo,
            String formaPagamento,
            String fornecedor,
            String status
    ) {
        this.id = id;
        this.descricao = descricao;
        this.categoria = categoria;
        this.valor = valor;
        this.data = data;
        this.tipo = tipo;
        this.formaPagamento = formaPagamento;
        this.fornecedor = fornecedor;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public String getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
