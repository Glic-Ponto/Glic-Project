package school.sptech.glic.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import school.sptech.glic.entity.Usuario;

public class UsuarioResponseDto {

    @Schema(description = "Identificador do usuário", example = "1")
    private Integer id;
    @Schema(description = "Nome do usuário", example = "Cláudio Gestor")
    private String nome;
    @Schema(description = "E-mail do usuário", example = "gestor@glic.local")
    private String email;
    @Schema(description = "Perfil de acesso: ADMIN, GERENTE ou FUNCIONARIO", example = "GERENTE")
    private String perfil;
    @Schema(description = "Foto de perfil em base64 (data URL). Nula quando o usuário não tem foto", example = "data:image/png;base64,iVBORw0KGgo...")
    private String foto;

    public UsuarioResponseDto() {
    }

    public UsuarioResponseDto(Usuario usuario) {
        this.id = usuario.getIdUsuario();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.perfil = usuario.getPerfil();
        this.foto = usuario.getFoto();
    }

    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getPerfil() { return perfil; }
    public String getFoto() { return foto; }
}
