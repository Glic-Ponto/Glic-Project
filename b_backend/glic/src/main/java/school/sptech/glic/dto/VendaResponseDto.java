package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import school.sptech.glic.entity.Venda;

import java.time.LocalDateTime;
import java.util.List;

public class VendaResponseDto {

    @Schema(description = "Identificador da venda", example = "1")
    private Integer id;

    @Schema(description = "Data e hora da venda", example = "2026-10-27T09:30:00")
    private LocalDateTime data;

    @Schema(description = "Valor total da venda já com o desconto aplicado", example = "570.0")
    private Double valorTotal;

    @Schema(description = "Desconto aplicado ao total da venda", example = "10.0")
    private Double desconto;

    @Schema(description = "Forma de pagamento: DINHEIRO, CARTAO, PIX ou CREDIARIO", example = "PIX")
    private String formaPagamento;

    @Schema(description = "Observação da venda", example = "Venda finalizada")
    private String observacao;

    @Schema(description = "Identificador do usuário que registrou a venda", example = "1")
    private Integer usuarioId;

    @Schema(description = "Nome do usuário que registrou a venda", example = "Cláudio Gestor")
    private String usuarioNome;

    @ArraySchema(schema = @Schema(description = "Item da venda"))
    private List<ItemVendaResponseDto> itens;

    public VendaResponseDto() {
    }

    public VendaResponseDto(Venda venda) {
        this.id = venda.getIdVenda();
        this.data = venda.getDataVenda();
        this.valorTotal = venda.getValorTotal();
        this.desconto = venda.getDesconto();
        this.formaPagamento = venda.getFormaPagamento();
        this.observacao = venda.getObservacao();
        this.usuarioId = venda.getUsuario() != null ? venda.getUsuario().getIdUsuario() : null;
        this.usuarioNome = venda.getUsuario() != null ? venda.getUsuario().getNome() : null;
        this.itens = venda.getItens().stream().map(ItemVendaResponseDto::new).toList();
    }

    public Integer getId() { return id; }
    public LocalDateTime getData() { return data; }
    public Double getValorTotal() { return valorTotal; }
    public Double getDesconto() { return desconto; }
    public String getFormaPagamento() { return formaPagamento; }
    public String getObservacao() { return observacao; }
    public Integer getUsuarioId() { return usuarioId; }
    public String getUsuarioNome() { return usuarioNome; }
    public List<ItemVendaResponseDto> getItens() { return itens; }
}
