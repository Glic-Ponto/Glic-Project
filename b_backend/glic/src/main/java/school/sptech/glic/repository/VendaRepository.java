package school.sptech.glic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.sptech.glic.entity.Venda;

import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Integer> {

    List<Venda> findByDataVendaBetween(LocalDateTime inicio, LocalDateTime fim);

    List<Venda> findAllByOrderByDataVendaDesc();
}
