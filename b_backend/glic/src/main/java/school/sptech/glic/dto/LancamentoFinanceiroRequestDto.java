package school.sptech.glic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class LancamentoFinanceiroRequestDto {

    private String vendaId;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotBlank(message = "A categoria é obrigatória")
    private String categoria;

    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser maior que zero")
    private Double valor;

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
