package school.sptech.glic.dto;

import school.sptech.glic.entity.Usuario;

public class UsuarioResponseDto {

    private Integer id;
    private String nome;
    private String email;
    private String perfil;
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
