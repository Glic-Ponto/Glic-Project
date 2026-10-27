package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UsuarioSenhaRequestDto {

    @Schema(description = "Senha atual do usuário", example = "Glic123!")
    @NotBlank(message = "A senha atual é obrigatória")
    private String senhaAtual;

    @Schema(description = "Nova senha do usuário", example = "NovaSenha123!")
    @NotBlank(message = "A nova senha é obrigatória")
    @Size(max = 255, message = "A senha deve ter no máximo 255 caracteres")
    private String senhaNova;

    public String getSenhaAtual() { return senhaAtual; }
    public void setSenhaAtual(String senhaAtual) { this.senhaAtual = senhaAtual; }
    public String getSenhaNova() { return senhaNova; }
    public void setSenhaNova(String senhaNova) { this.senhaNova = senhaNova; }
}
