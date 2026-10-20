package school.sptech.glic.dto;

public class ServicoRankingDto {

    private String id;
    private String nome;
    private Integer quantidade;

    public ServicoRankingDto() {
    }

    public ServicoRankingDto(String id, String nome, Integer quantidade) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}
