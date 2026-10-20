package school.sptech.glic.dto;

public class CategoriaValorDto {

    private String nome;
    private Double valor;

    public CategoriaValorDto() {
    }

    public CategoriaValorDto(String nome, Double valor) {
        this.nome = nome;
        this.valor = valor;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }
}
