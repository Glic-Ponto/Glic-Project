package school.sptech.glic.service;

import org.springframework.stereotype.Service;
import school.sptech.glic.dto.LancamentoFinanceiroRequestDto;
import school.sptech.glic.dto.LancamentoFinanceiroResponseDto;
import school.sptech.glic.entity.Despesa;
import school.sptech.glic.entity.MovimentacaoFinanceira;
import school.sptech.glic.repository.DespesaRepository;
import school.sptech.glic.repository.MovimentacaoFinanceiraRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinanceiroService {

    private final MovimentacaoFinanceiraRepository movimentacaoRepository;
    private final DespesaRepository despesaRepository;

    public FinanceiroService(
            MovimentacaoFinanceiraRepository movimentacaoRepository,
            DespesaRepository despesaRepository
    ) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.despesaRepository = despesaRepository;
    }

    public List<LancamentoFinanceiroResponseDto> listarReceitas() {
        List<MovimentacaoFinanceira> receitas = movimentacaoRepository
                .findByTipoIgnoreCaseOrderByDataMovimentacaoDesc("RECEITA");

        List<LancamentoFinanceiroResponseDto> resposta = new ArrayList<>();
        for (MovimentacaoFinanceira mov : receitas) {
            String categoria = (mov.getObservacao() != null && !mov.getObservacao().isBlank())
                    ? mov.getObservacao()
                    : "Vendas";
            resposta.add(new LancamentoFinanceiroResponseDto(
                    mov.getIdMovimentacao(),
                    mov.getDescricao(),
                    categoria,
                    mov.getValor(),
                    mov.getDataMovimentacao(),
                    "RECEITA",
                    mov.getFormaPagamento(),
                    null,
                    "PAGA"
            ));
        }
        return resposta;
    }

    public List<LancamentoFinanceiroResponseDto> listarDespesas() {
        List<Despesa> despesas = despesaRepository.findAllByOrderByDataVencimentoDesc();

        List<LancamentoFinanceiroResponseDto> resposta = new ArrayList<>();
        for (Despesa despesa : despesas) {
            MovimentacaoFinanceira mov = despesa.getMovimentacaoFinanceira();
            LocalDateTime data = mov != null && mov.getDataMovimentacao() != null
                    ? mov.getDataMovimentacao()
                    : despesa.getDataVencimento().atStartOfDay();

            String descricao = mov != null && mov.getDescricao() != null
                    ? mov.getDescricao()
                    : (despesa.getObservacao() != null ? despesa.getObservacao() : despesa.getFornecedor());

            String formaPagamento = mov != null ? mov.getFormaPagamento() : "TRANSFERENCIA";

            resposta.add(new LancamentoFinanceiroResponseDto(
                    despesa.getIdDespesa(),
                    descricao,
                    despesa.getCategoria(),
                    despesa.getValor(),
                    data,
                    "DESPESA",
                    formaPagamento,
                    despesa.getFornecedor(),
                    despesa.getStatus()
            ));
        }
        return resposta;
    }

    public LancamentoFinanceiroResponseDto cadastrarReceita(LancamentoFinanceiroRequestDto dto) {
        LocalDateTime dataLancamento = dto.getData() != null ? dto.getData() : LocalDateTime.now();

        MovimentacaoFinanceira mov = new MovimentacaoFinanceira(
                null,
                "RECEITA",
                dataLancamento,
                dto.getDescricao(),
                "PIX",
                dto.getValor(),
                dto.getCategoria()
        );
        MovimentacaoFinanceira salva = movimentacaoRepository.save(mov);

        return new LancamentoFinanceiroResponseDto(
                salva.getIdMovimentacao(),
                salva.getDescricao(),
                dto.getCategoria(),
                salva.getValor(),
                salva.getDataMovimentacao(),
                "RECEITA",
                salva.getFormaPagamento(),
                null,
                "PAGA"
        );
    }

    public LancamentoFinanceiroResponseDto cadastrarDespesa(LancamentoFinanceiroRequestDto dto) {
        LocalDateTime dataLancamento = dto.getData() != null ? dto.getData() : LocalDateTime.now();

        MovimentacaoFinanceira mov = new MovimentacaoFinanceira(
                null,
                "DESPESA",
                dataLancamento,
                dto.getDescricao(),
                "TRANSFERENCIA",
                dto.getValor(),
                dto.getCategoria()
        );
        MovimentacaoFinanceira movSalva = movimentacaoRepository.save(mov);

        Despesa despesa = new Despesa(
                movSalva,
                dto.getCategoria(),
                "Fornecedor Padrão",
                dataLancamento.toLocalDate(),
                dto.getValor(),
                "PAGA",
                dto.getDescricao()
        );
        Despesa despesaSalva = despesaRepository.save(despesa);

        return new LancamentoFinanceiroResponseDto(
                despesaSalva.getIdDespesa(),
                dto.getDescricao(),
                despesaSalva.getCategoria(),
                despesaSalva.getValor(),
                dataLancamento,
                "DESPESA",
                movSalva.getFormaPagamento(),
                despesaSalva.getFornecedor(),
                despesaSalva.getStatus()
        );
    }
}
