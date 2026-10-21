package school.sptech.glic;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import school.sptech.glic.dto.ProdutoRequestDto;
import school.sptech.glic.dto.ProdutoResponseDto;
import school.sptech.glic.service.ProdutoService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
@Transactional
class ProdutoServiceIntegrationTest {

    @Autowired
    private ProdutoService produtoService;

    @Test
    void cadastraEAtualizaFornecedorSemAlterarDemaisDados() {
        ProdutoRequestDto cadastro = produto("  Glic Distribuidora  ");
        ProdutoResponseDto salvo = produtoService.cadastrar(cadastro);

        assertEquals("Glic Distribuidora", salvo.getFornecedor());
        assertEquals(8, salvo.getQuantidade());
        assertEquals(199.90, salvo.getPreco());

        ProdutoRequestDto edicao = produto("Distribuidora Central");
        ProdutoResponseDto atualizado = produtoService.atualizar(salvo.getId(), edicao);

        assertEquals("Distribuidora Central", atualizado.getFornecedor());
        assertEquals(salvo.getQuantidade(), atualizado.getQuantidade());
        assertEquals(salvo.getPreco(), atualizado.getPreco());
        assertEquals("Produto de teste", produtoService.buscar(salvo.getId()).getNome());
    }

    @Test
    void permiteProdutoSemFornecedor() {
        ProdutoResponseDto salvo = produtoService.cadastrar(produto("   "));
        assertNull(salvo.getFornecedor());
    }

    private ProdutoRequestDto produto(String fornecedor) {
        ProdutoRequestDto dto = new ProdutoRequestDto();
        dto.setNome("Produto de teste");
        dto.setCategoria("Categoria de teste");
        dto.setMarca("Marca de teste");
        dto.setFornecedor(fornecedor);
        dto.setQuantidade(8);
        dto.setPreco(199.90);
        dto.setMinimo(2);
        dto.setUnidade("un.");
        return dto;
    }
}
