package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UsuarioAtualizacaoRequestDto {

    @Schema(description = "Nome do usuário", example = "Cláudio Gestor")
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    private String nome;

    @Schema(description = "E-mail do usuário", example = "gestor@glic.local")
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    @Size(max = 100, message = "O e-mail deve ter no máximo 100 caracteres")
    private String email;

    @Schema(description = "Foto de perfil em base64 (data URL). Vazia ou nula remove a foto", example = "data:image/png;base64,iVBORw0KGgo...")
    private String foto;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}
