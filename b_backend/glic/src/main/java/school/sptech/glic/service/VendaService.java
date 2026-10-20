package school.sptech.glic.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import school.sptech.glic.dto.ItemVendaRequestDto;
import school.sptech.glic.dto.VendaRequestDto;
import school.sptech.glic.entity.ItemVenda;
import school.sptech.glic.entity.MovimentacaoFinanceira;
import school.sptech.glic.entity.Produto;
import school.sptech.glic.entity.Usuario;
import school.sptech.glic.entity.Venda;
import school.sptech.glic.repository.MovimentacaoFinanceiraRepository;
import school.sptech.glic.repository.ProdutoRepository;
import school.sptech.glic.repository.UsuarioRepository;
import school.sptech.glic.repository.VendaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MovimentacaoFinanceiraRepository movimentacaoRepository;

    public VendaService(
            VendaRepository vendaRepository,
            ProdutoRepository produtoRepository,
            UsuarioRepository usuarioRepository,
            MovimentacaoFinanceiraRepository movimentacaoRepository
    ) {
        this.vendaRepository = vendaRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    public List<Venda> listarVendas() {
        return vendaRepository.findAllByOrderByDataVendaDesc();
    }

    public Venda registrarVenda(VendaRequestDto dto) {
        double subtotalVenda = 0.0;

        Venda venda = new Venda();
        venda.setDataVenda(dto.getData() != null ? dto.getData() : LocalDateTime.now());
        venda.setFormaPagamento(dto.getPagamento() != null && !dto.getPagamento().isBlank() ? dto.getPagamento() : "PIX");
        venda.setObservacao("Venda finalizada");

        List<Usuario> usuarios = usuarioRepository.findAll();
        if (!usuarios.isEmpty()) {
            venda.setUsuario(usuarios.get(0));
        }

        for (ItemVendaRequestDto itemDto : dto.getItens()) {
            Produto produto = buscarOuCriarProduto(itemDto);

            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setQuantidade(itemDto.getQuantidade());
            item.setPrecoUnitario(itemDto.getPreco());
            item.setDesconto(0.0);

            double subtotalItem = itemDto.getPreco() * itemDto.getQuantidade();
            item.setSubtotal(subtotalItem);
            subtotalVenda += subtotalItem;

            venda.adicionarItem(item);
        }

        double desconto = dto.getDesconto() != null ? dto.getDesconto() : 0.0;
        if (desconto > subtotalVenda) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O desconto não pode ser maior que o subtotal da venda."
            );
        }

        venda.setDesconto(desconto);
        venda.setValorTotal(subtotalVenda - desconto);

        Venda salva = vendaRepository.save(venda);

        String codigoVenda = String.format("V-%04d", salva.getIdVenda());
        MovimentacaoFinanceira mov = new MovimentacaoFinanceira(
                salva,
                "RECEITA",
                salva.getDataVenda(),
                "Venda " + codigoVenda,
                salva.getFormaPagamento(),
                salva.getValorTotal(),
                "Vendas"
        );
        movimentacaoRepository.save(mov);

        return salva;
    }

    private Produto buscarOuCriarProduto(ItemVendaRequestDto itemDto) {
        Optional<Produto> existente = produtoRepository.findFirstByNomeIgnoreCase(itemDto.getNome());
        if (existente.isPresent()) {
            return existente.get();
        }
        String descricaoServico = (itemDto.getServico() != null && !itemDto.getServico().isBlank())
                ? itemDto.getServico()
                : itemDto.getNome();
        Produto novo = new Produto(
                itemDto.getNome(),
                descricaoServico,
                itemDto.getCategoria(),
                itemDto.getPreco(),
                10,
                2,
                true
        );
        return produtoRepository.save(novo);
    }
}
