package school.sptech.glic.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import school.sptech.glic.dto.UsuarioAtualizacaoRequestDto;
import school.sptech.glic.dto.UsuarioCadastroRequestDto;
import school.sptech.glic.dto.UsuarioLoginRequestDto;
import school.sptech.glic.dto.UsuarioResponseDto;
import school.sptech.glic.dto.UsuarioSenhaRequestDto;
import school.sptech.glic.entity.Usuario;
import school.sptech.glic.repository.UsuarioRepository;

import java.time.LocalDateTime;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDto autenticar(UsuarioLoginRequestDto dto) {
        // Senha em texto puro por enquanto; será revisto na migração para MySQL.
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(dto.getEmail().trim())
                .filter(encontrado -> encontrado.getSenha().equals(dto.getSenha()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos."));
        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esta conta está inativa.");
        }
        return new UsuarioResponseDto(usuario);
    }

    @Transactional
    public UsuarioResponseDto cadastrar(UsuarioCadastroRequestDto dto) {
        String email = dto.getEmail().trim();
        if (usuarioRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário com este e-mail.");
        }
        Usuario usuario = new Usuario(dto.getNome().trim(), email, dto.getSenha(), "FUNCIONARIO", true, LocalDateTime.now());
        return new UsuarioResponseDto(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponseDto atualizar(Integer id, UsuarioAtualizacaoRequestDto dto) {
        Usuario usuario = encontrar(id);
        String email = dto.getEmail().trim();
        // O próprio usuário pode manter o e-mail atual; só conflita se pertencer a outro usuário.
        boolean emailEmUso = usuarioRepository.findByEmailIgnoreCase(email)
                .filter(existente -> !existente.getIdUsuario().equals(id))
                .isPresent();
        if (emailEmUso) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário com este e-mail.");
        }
        usuario.setNome(dto.getNome().trim());
        usuario.setEmail(email);
        usuario.setFoto(normalizarOpcional(dto.getFoto()));
        return new UsuarioResponseDto(usuarioRepository.save(usuario));
    }

    @Transactional
    public void atualizarSenha(Integer id, UsuarioSenhaRequestDto dto) {
        Usuario usuario = encontrar(id);
        if (!usuario.getSenha().equals(dto.getSenhaAtual())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "A senha atual está incorreta.");
        }
        usuario.setSenha(dto.getSenhaNova());
        usuarioRepository.save(usuario);
    }

    private Usuario encontrar(Integer id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    private String normalizarOpcional(String valor) {
        if (valor == null || valor.isBlank()) return null;
        return valor.trim();
    }
}
