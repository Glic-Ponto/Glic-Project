package school.sptech.glic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.sptech.glic.entity.Produto;

import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    Optional<Produto> findFirstByNomeIgnoreCase(String nome);
}
