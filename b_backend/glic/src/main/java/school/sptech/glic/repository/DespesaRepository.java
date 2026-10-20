package school.sptech.glic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.sptech.glic.entity.Despesa;

import java.time.LocalDate;
import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Integer> {

    List<Despesa> findByDataVencimentoBetween(LocalDate inicio, LocalDate fim);

    List<Despesa> findAllByOrderByDataVencimentoDesc();
}
