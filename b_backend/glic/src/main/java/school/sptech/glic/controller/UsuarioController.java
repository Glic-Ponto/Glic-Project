package school.sptech.glic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import school.sptech.glic.dto.UsuarioAtualizacaoRequestDto;
import school.sptech.glic.dto.UsuarioCadastroRequestDto;
import school.sptech.glic.dto.UsuarioLoginRequestDto;
import school.sptech.glic.dto.UsuarioResponseDto;
import school.sptech.glic.dto.UsuarioSenhaRequestDto;
import school.sptech.glic.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
@Tag(name = "Usuários", description = "Endpoints de login, cadastro e perfil de usuários")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar usuário", description = "Valida e-mail e senha e retorna os dados do usuário.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário autenticado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de login inválidos"),
            @ApiResponse(responseCode = "401", description = "E-mail ou senha incorretos"),
            @ApiResponse(responseCode = "403", description = "Conta inativa")
    })
    public ResponseEntity<UsuarioResponseDto> login(@Valid @RequestBody UsuarioLoginRequestDto dto) {
        return ResponseEntity.ok(usuarioService.autenticar(dto));
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastrar usuário", description = "Cria um novo usuário com perfil FUNCIONARIO.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de cadastro inválidos"),
            @ApiResponse(responseCode = "409", description = "Já existe um usuário com este e-mail")
    })
    public ResponseEntity<UsuarioResponseDto> cadastrar(@Valid @RequestBody UsuarioCadastroRequestDto dto) {
        return ResponseEntity.status(201).body(usuarioService.cadastrar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados do usuário", description = "Atualiza nome, e-mail e foto do usuário.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            @ApiResponse(responseCode = "409", description = "Já existe outro usuário com este e-mail")
    })
    public ResponseEntity<UsuarioResponseDto> atualizar(@PathVariable Integer id, @Valid @RequestBody UsuarioAtualizacaoRequestDto dto) {
        return ResponseEntity.ok(usuarioService.atualizar(id, dto));
    }

    @PutMapping("/{id}/senha")
    @Operation(summary = "Alterar senha do usuário", description = "Valida a senha atual e grava a nova senha.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Senha alterada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Senha atual incorreta"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<Void> atualizarSenha(@PathVariable Integer id, @Valid @RequestBody UsuarioSenhaRequestDto dto) {
        usuarioService.atualizarSenha(id, dto);
        return ResponseEntity.noContent().build();
    }
}
