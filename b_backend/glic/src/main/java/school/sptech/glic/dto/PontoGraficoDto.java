package school.sptech.glic.dto;

public class PontoGraficoDto {

    private String nome;
    private String rotuloCompleto;
    private Double valor;
    private String chave;

    public PontoGraficoDto() {
    }

    public PontoGraficoDto(String nome, String rotuloCompleto, Double valor, String chave) {
        this.nome = nome;
        this.rotuloCompleto = rotuloCompleto;
        this.valor = valor;
        this.chave = chave;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getRotuloCompleto() {
        return rotuloCompleto;
    }

    public void setRotuloCompleto(String rotuloCompleto) {
        this.rotuloCompleto = rotuloCompleto;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getChave() {
        return chave;
    }

    public void setChave(String chave) {
        this.chave = chave;
    }
}
