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

import java.time.LocalDate;

@Entity
@Table(name = "despesa")
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_despesa")
    private Integer idDespesa;

    @ManyToOne
    @JoinColumn(name = "id_movimentacao")
    private MovimentacaoFinanceira movimentacaoFinanceira;

    @NotBlank
    @Column(name = "categoria", length = 100, nullable = false)
    private String categoria;

    @Column(name = "fornecedor", length = 100)
    private String fornecedor;

    @NotNull
    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @NotNull
    @PositiveOrZero
    @Column(name = "valor", nullable = false)
    private Double valor;

    @NotBlank
    @Column(name = "status", length = 20, nullable = false)
    private String status; // PENDENTE, PAGA

    @Column(name = "observacao", length = 200)
    private String observacao;

    public Despesa() {
    }

    public Despesa(
            MovimentacaoFinanceira movimentacaoFinanceira,
            String categoria,
            String fornecedor,
            LocalDate dataVencimento,
            Double valor,
            String status,
            String observacao
    ) {
        this.movimentacaoFinanceira = movimentacaoFinanceira;
        this.categoria = categoria;
        this.fornecedor = fornecedor;
        this.dataVencimento = dataVencimento;
        this.valor = valor;
        this.status = status;
        this.observacao = observacao;
    }

    public Integer getIdDespesa() {
        return idDespesa;
    }

    public void setIdDespesa(Integer idDespesa) {
        this.idDespesa = idDespesa;
    }

    public MovimentacaoFinanceira getMovimentacaoFinanceira() {
        return movimentacaoFinanceira;
    }

    public void setMovimentacaoFinanceira(MovimentacaoFinanceira movimentacaoFinanceira) {
        this.movimentacaoFinanceira = movimentacaoFinanceira;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDate dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
