package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;
import java.util.List;

public class VendaRequestDto {

    @Schema(description = "Código da venda no front-end. Atualmente não é gravado pelo back-end", example = "V-0001")
    private String codigo;
    @Schema(description = "Status da venda no front-end. Atualmente não é gravado pelo back-end", example = "finalizada")
    private String status;
    @Schema(description = "Data e hora da venda. Se não for informada, usa a data e hora atuais", example = "2026-10-27T09:30:00")
    private LocalDateTime data;

    @Schema(description = "Desconto aplicado ao total da venda. Não pode ser maior que o subtotal", example = "10.0")
    @NotNull(message = "O desconto é obrigatório")
    @PositiveOrZero(message = "O desconto não pode ser negativo")
    private Double desconto;

    @Schema(description = "Identificador do usuário no front-end. Atualmente não é gravado pelo back-end", example = "1")
    private String usuarioId;
    @Schema(description = "Nome do usuário no front-end. Atualmente não é gravado pelo back-end", example = "Cláudio Gestor")
    private String usuarioNome;
    @Schema(description = "Nome do cliente. Atualmente não é gravado pelo back-end", example = "João Silva")
    private String cliente;
    @Schema(description = "Veículo do cliente. Atualmente não é gravado pelo back-end", example = "Onix 2020")
    private String veiculo;
    @Schema(description = "Forma de pagamento: DINHEIRO, CARTAO, PIX ou CREDIARIO. Se não for informada, usa PIX", example = "PIX")
    private String pagamento;

    @ArraySchema(schema = @Schema(description = "Item da venda"), minItems = 1)
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
