package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class LancamentoFinanceiroRequestDto {

    @Schema(description = "Identificador da venda relacionada. Atualmente não é utilizado pelo back-end", example = "1")
    private String vendaId;

    @Schema(description = "Descrição do lançamento", example = "Conta de energia elétrica da oficina")
    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @Schema(description = "Categoria do lançamento", example = "Infraestrutura")
    @NotBlank(message = "A categoria é obrigatória")
    private String categoria;

    @Schema(description = "Valor do lançamento", example = "450.0")
    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser maior que zero")
    private Double valor;

    @Schema(description = "Data e hora do lançamento. Se não for informada, usa a data e hora atuais", example = "2026-10-27T09:00:00")
    private LocalDateTime data;

    public LancamentoFinanceiroRequestDto() {
    }

    public String getVendaId() {
        return vendaId;
    }

    public void setVendaId(String vendaId) {
        this.vendaId = vendaId;
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
}
