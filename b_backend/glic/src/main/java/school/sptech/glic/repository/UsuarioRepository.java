package school.sptech.glic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school.sptech.glic.entity.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmailIgnoreCase(String email);
}
