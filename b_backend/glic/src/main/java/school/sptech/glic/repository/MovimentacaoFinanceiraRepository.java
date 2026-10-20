package school.sptech.glic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.sptech.glic.entity.MovimentacaoFinanceira;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimentacaoFinanceiraRepository extends JpaRepository<MovimentacaoFinanceira, Integer> {

    List<MovimentacaoFinanceira> findByTipoIgnoreCaseAndDataMovimentacaoBetween(
            String tipo,
            LocalDateTime inicio,
            LocalDateTime fim
    );

    List<MovimentacaoFinanceira> findByTipoIgnoreCaseOrderByDataMovimentacaoDesc(String tipo);
}
