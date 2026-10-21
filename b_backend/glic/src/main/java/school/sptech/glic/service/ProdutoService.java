package school.sptech.glic.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import school.sptech.glic.dto.ProdutoRequestDto;
import school.sptech.glic.dto.ProdutoResponseDto;
import school.sptech.glic.entity.Produto;
import school.sptech.glic.repository.ProdutoRepository;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDto> listar() {
        return produtoRepository.findAll().stream().map(ProdutoResponseDto::new).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDto buscar(Integer id) {
        return new ProdutoResponseDto(encontrar(id));
    }

    @Transactional
    public ProdutoResponseDto cadastrar(ProdutoRequestDto dto) {
        Produto produto = new Produto();
        aplicar(dto, produto);
        produto.setAtivo(true);
        return new ProdutoResponseDto(produtoRepository.save(produto));
    }

    @Transactional
    public ProdutoResponseDto atualizar(Integer id, ProdutoRequestDto dto) {
        Produto produto = encontrar(id);
        aplicar(dto, produto);
        return new ProdutoResponseDto(produtoRepository.save(produto));
    }

    private Produto encontrar(Integer id) {
        return produtoRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));
    }

    private void aplicar(ProdutoRequestDto dto, Produto produto) {
        produto.setNome(dto.getNome().trim());
        produto.setCategoria(dto.getCategoria().trim());
        produto.setMarca(dto.getMarca().trim());
        produto.setFornecedor(normalizarOpcional(dto.getFornecedor()));
        produto.setQuantidadeEstoque(dto.getQuantidade());
        produto.setPrecoVenda(dto.getPreco());
        produto.setEstoqueMinimo(dto.getMinimo());
        produto.setUnidade(dto.getUnidade().trim());
        produto.setImagem(normalizarOpcional(dto.getImagem()));
    }

    private String normalizarOpcional(String valor) {
        if (valor == null || valor.isBlank()) return null;
        return valor.trim();
    }
}
