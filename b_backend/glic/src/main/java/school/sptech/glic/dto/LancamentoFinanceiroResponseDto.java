package school.sptech.glic.dto;

import java.time.LocalDateTime;

public class LancamentoFinanceiroResponseDto {

    private Integer id;
    private String descricao;
    private String categoria;
    private Double valor;
    private LocalDateTime data;
    private String tipo;
    private String formaPagamento;
    private String fornecedor;
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
