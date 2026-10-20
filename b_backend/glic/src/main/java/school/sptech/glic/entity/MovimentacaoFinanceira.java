package school.sptech.glic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacao_financeira")
public class MovimentacaoFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimentacao")
    private Integer idMovimentacao;

    @ManyToOne
    @JoinColumn(name = "id_venda")
    private Venda venda;

    @NotBlank
    @Column(name = "tipo", length = 20, nullable = false)
    private String tipo; // RECEITA, DESPESA

    @NotNull
    @Column(name = "data_movimentacao", nullable = false)
    private LocalDateTime dataMovimentacao;

    @NotBlank
    @Column(name = "descricao", length = 200, nullable = false)
    private String descricao;

    @Column(name = "forma_pagamento", length = 30)
    private String formaPagamento; // DINHEIRO, CARTAO, PIX, TRANSFERENCIA

    @NotNull
    @PositiveOrZero
    @Column(name = "valor", nullable = false)
    private Double valor;

    @Column(name = "observacao", length = 200)
    private String observacao;

    public MovimentacaoFinanceira() {
    }

    public MovimentacaoFinanceira(
            Venda venda,
            String tipo,
            LocalDateTime dataMovimentacao,
            String descricao,
            String formaPagamento,
            Double valor,
            String observacao
    ) {
        this.venda = venda;
        this.tipo = tipo;
        this.dataMovimentacao = dataMovimentacao;
        this.descricao = descricao;
        this.formaPagamento = formaPagamento;
        this.valor = valor;
        this.observacao = observacao;
    }

    public Integer getIdMovimentacao() {
        return idMovimentacao;
    }

    public void setIdMovimentacao(Integer idMovimentacao) {
        this.idMovimentacao = idMovimentacao;
    }

    public Venda getVenda() {
        return venda;
    }

    public void setVenda(Venda venda) {
        this.venda = venda;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getDataMovimentacao() {
        return dataMovimentacao;
    }

    public void setDataMovimentacao(LocalDateTime dataMovimentacao) {
        this.dataMovimentacao = dataMovimentacao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
