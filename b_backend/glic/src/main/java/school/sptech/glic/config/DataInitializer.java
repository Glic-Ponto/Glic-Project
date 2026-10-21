package school.sptech.glic.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import school.sptech.glic.entity.Despesa;
import school.sptech.glic.entity.EntradaEstoque;
import school.sptech.glic.entity.ItemVenda;
import school.sptech.glic.entity.MovimentacaoFinanceira;
import school.sptech.glic.entity.Produto;
import school.sptech.glic.entity.Usuario;
import school.sptech.glic.entity.Venda;
import school.sptech.glic.repository.DespesaRepository;
import school.sptech.glic.repository.EntradaEstoqueRepository;
import school.sptech.glic.repository.MovimentacaoFinanceiraRepository;
import school.sptech.glic.repository.ProdutoRepository;
import school.sptech.glic.repository.UsuarioRepository;
import school.sptech.glic.repository.VendaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final EntradaEstoqueRepository entradaEstoqueRepository;
    private final VendaRepository vendaRepository;
    private final MovimentacaoFinanceiraRepository movimentacaoRepository;
    private final DespesaRepository despesaRepository;

    public DataInitializer(
            UsuarioRepository usuarioRepository,
            ProdutoRepository produtoRepository,
            EntradaEstoqueRepository entradaEstoqueRepository,
            VendaRepository vendaRepository,
            MovimentacaoFinanceiraRepository movimentacaoRepository,
            DespesaRepository despesaRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.produtoRepository = produtoRepository;
        this.entradaEstoqueRepository = entradaEstoqueRepository;
        this.vendaRepository = vendaRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.despesaRepository = despesaRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0 || vendaRepository.count() > 0) {
            return;
        }

        LocalDate hoje = LocalDate.now();
        LocalDateTime agora = LocalDateTime.now();

        // 1. Popular tabela USUARIO
        Usuario gestor = new Usuario("Cláudio Gestor", "gestor@glic.local", "Glic123!", "GERENTE", true, agora.minusDays(30));
        Usuario funcionario = new Usuario("Vânia Funcionária", "funcionario@glic.local", "Glic123!", "FUNCIONARIO", true, agora.minusDays(25));
        Usuario admin = new Usuario("Administrador GLIC", "admin@glic.local", "Glic123!", "ADMIN", true, agora.minusDays(60));
        usuarioRepository.saveAll(List.of(gestor, funcionario, admin));

        // 2. Popular tabela PRODUTO
        Produto pelicula = new Produto("Película automotiva", "Instalação de insulfilm", "Películas", "Glic", "3M Auto Film", 180.0, 12, 3, "un.", null, true);
        Produto multimidia = new Produto("Central multimídia", "Instalação de multimídia", "Multimídia", "Universal", "Pioneer Distribuidora", 890.0, 5, 2, "un.", null, true);
        Produto cameraRe = new Produto("Câmera de ré", "Instalação de acessórios", "Acessórios", "Universal", "TechCar Acessórios", 220.0, 4, 3, "un.", null, true);
        Produto sensor = new Produto("Sensor de estacionamento", "Instalação de acessórios", "Acessórios", "Universal", null, 160.0, 6, 2, "un.", null, true);
        produtoRepository.saveAll(List.of(pelicula, multimidia, cameraRe, sensor));

        // 3. Popular tabela ENTRADA_ESTOQUE
        EntradaEstoque entrada1 = new EntradaEstoque(pelicula, hoje.atTime(8, 30), 10, 95.0, "3M Auto Film", "Reposição de bobinas G20");
        EntradaEstoque entrada2 = new EntradaEstoque(multimidia, hoje.minusDays(3).atTime(10, 0), 5, 520.0, "Pioneer Distribuidora", "Centrais multimídia 9 pol");
        EntradaEstoque entrada3 = new EntradaEstoque(cameraRe, hoje.minusDays(7).atTime(14, 0), 6, 110.0, "TechCar Acessórios", "Câmeras de ré HD");
        entradaEstoqueRepository.saveAll(List.of(entrada1, entrada2, entrada3));

        // 4. Popular tabelas VENDA, ITEM_VENDA e MOVIMENTACAO_FINANCEIRA (RECEITA)
        registrarVendaInicial(funcionario, hoje.atTime(9, 30), 10.0, "PIX", "Aplicação película + câmera", List.of(
                criarItem(pelicula, 2, 180.0),
                criarItem(cameraRe, 1, 220.0)
        ));

        registrarVendaInicial(gestor, hoje.atTime(14, 15), 40.0, "CARTAO", "Kit multimídia completo", List.of(
                criarItem(multimidia, 1, 890.0),
                criarItem(sensor, 1, 160.0)
        ));

        registrarVendaInicial(funcionario, hoje.minusDays(2).atTime(11, 0), 20.0, "DINHEIRO", "Película completa", List.of(
                criarItem(pelicula, 3, 180.0)
        ));

        registrarVendaInicial(funcionario, hoje.minusDays(5).atTime(16, 20), 50.0, "CARTAO", "Instalação multimídia e câmera", List.of(
                criarItem(multimidia, 2, 890.0),
                criarItem(cameraRe, 2, 220.0)
        ));

        registrarVendaInicial(gestor, hoje.minusDays(15).atTime(10, 45), 0.0, "PIX", "Película e sensor", List.of(
                criarItem(pelicula, 2, 180.0),
                criarItem(sensor, 2, 160.0)
        ));

        // 5. Popular tabelas MOVIMENTACAO_FINANCEIRA (DESPESA) e DESPESA
        registrarDespesaInicial("Compra de bobinas de película", "Fornecedores", "3M Auto Film", 320.0, "PIX", "PAGA", hoje.atTime(8, 30));
        registrarDespesaInicial("Reposição de centrais multimídia", "Fornecedores", "Pioneer Distribuidora", 1200.0, "TRANSFERENCIA", "PAGA", hoje.minusDays(3).atTime(10, 0));
        registrarDespesaInicial("Conta de energia elétrica da oficina", "Infraestrutura", "Enel SP", 450.0, "PIX", "PAGA", hoje.minusDays(12).atTime(9, 0));
    }

    private ItemVenda criarItem(Produto produto, int quantidade, double precoUnitario) {
        ItemVenda item = new ItemVenda();
        item.setProduto(produto);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(precoUnitario);
        item.setDesconto(0.0);
        item.setSubtotal(precoUnitario * quantidade);
        return item;
    }

    private void registrarVendaInicial(
            Usuario usuario,
            LocalDateTime dataVenda,
            double desconto,
            String formaPagamento,
            String observacao,
            List<ItemVenda> itens
    ) {
        double subtotal = 0.0;
        Venda venda = new Venda();
        venda.setUsuario(usuario);
        venda.setDataVenda(dataVenda);
        venda.setDesconto(desconto);
        venda.setFormaPagamento(formaPagamento);
        venda.setObservacao(observacao);

        for (ItemVenda item : itens) {
            subtotal += item.getSubtotal();
            venda.adicionarItem(item);
        }

        venda.setValorTotal(subtotal - desconto);
        Venda vendaSalva = vendaRepository.save(venda);

        String codigo = String.format("V-%04d", vendaSalva.getIdVenda());
        MovimentacaoFinanceira receita = new MovimentacaoFinanceira(
                vendaSalva,
                "RECEITA",
                dataVenda,
                "Venda " + codigo + " - " + observacao,
                formaPagamento,
                vendaSalva.getValorTotal(),
                "Vendas"
        );
        movimentacaoRepository.save(receita);
    }

    private void registrarDespesaInicial(
            String descricao,
            String categoria,
            String fornecedor,
            double valor,
            String formaPagamento,
            String status,
            LocalDateTime data
    ) {
        MovimentacaoFinanceira mov = new MovimentacaoFinanceira(
                null,
                "DESPESA",
                data,
                descricao,
                formaPagamento,
                valor,
                categoria
        );
        MovimentacaoFinanceira movSalva = movimentacaoRepository.save(mov);

        Despesa despesa = new Despesa(
                movSalva,
                categoria,
                fornecedor,
                data.toLocalDate(),
                valor,
                status,
                descricao
        );
        despesaRepository.save(despesa);
    }
}
