package school.sptech.glic.dto;

import java.time.LocalDateTime;

public class IntervaloDashboardDto {

    private LocalDateTime inicio;
    private LocalDateTime fim;
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
