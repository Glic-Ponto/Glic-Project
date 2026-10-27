package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public class IntervaloDashboardDto {

    @Schema(description = "Data e hora de início do intervalo", example = "2026-10-27T00:00:00")
    private LocalDateTime inicio;
    @Schema(description = "Data e hora de fim do intervalo", example = "2026-10-27T23:59:59.999")
    private LocalDateTime fim;
    @Schema(description = "Indica se o gráfico é agrupado por hora (período de um único dia)", example = "true")
    private boolean porHora;

    public IntervaloDashboardDto() {
    }

    public IntervaloDashboardDto(LocalDateTime inicio, LocalDateTime fim, boolean porHora) {
        this.inicio = inicio;
        this.fim = fim;
        this.porHora = porHora;
    }

    public LocalDateTime getInicio() {
        return inicio;
    }

    public void setInicio(LocalDateTime inicio) {
        this.inicio = inicio;
    }

    public LocalDateTime getFim() {
        return fim;
    }

    public void setFim(LocalDateTime fim) {
        this.fim = fim;
    }

    public boolean isPorHora() {
        return porHora;
    }

    public void setPorHora(boolean porHora) {
        this.porHora = porHora;
    }
}
