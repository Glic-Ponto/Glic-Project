package school.sptech.glic.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;
import java.util.List;

public class VendaRequestDto {

    private String codigo;
    private String status;
    private LocalDateTime data;

    @NotNull(message = "O desconto é obrigatório")
    @PositiveOrZero(message = "O desconto não pode ser negativo")
    private Double desconto;

    private String usuarioId;
    private String usuarioNome;
    private String cliente;
    private String veiculo;
    private String pagamento;

    @NotEmpty(message = "A venda deve possuir ao menos um item")
    @Valid
    private List<ItemVendaRequestDto> itens;

    public VendaRequestDto() {
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public Double getDesconto() {
        return desconto;
    }

    public void setDesconto(Double desconto) {
        this.desconto = desconto;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public void setUsuarioNome(String usuarioNome) {
        this.usuarioNome = usuarioNome;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(String veiculo) {
        this.veiculo = veiculo;
    }

    public String getPagamento() {
        return pagamento;
    }

    public void setPagamento(String pagamento) {
        this.pagamento = pagamento;
    }

    public List<ItemVendaRequestDto> getItens() {
        return itens;
    }

    public void setItens(List<ItemVendaRequestDto> itens) {
        this.itens = itens;
    }
}
