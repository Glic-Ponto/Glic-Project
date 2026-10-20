package school.sptech.glic.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import school.sptech.glic.dto.CategoriaValorDto;
import school.sptech.glic.dto.DashboardResumoResponseDto;
import school.sptech.glic.dto.IntervaloDashboardDto;
import school.sptech.glic.dto.PontoGraficoDto;
import school.sptech.glic.dto.ServicoRankingDto;
import school.sptech.glic.entity.ItemVenda;
import school.sptech.glic.entity.MovimentacaoFinanceira;
import school.sptech.glic.entity.Produto;
import school.sptech.glic.entity.Venda;
import school.sptech.glic.repository.MovimentacaoFinanceiraRepository;
import school.sptech.glic.repository.VendaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class DashboardService {

    private final VendaRepository vendaRepository;
    private final MovimentacaoFinanceiraRepository movimentacaoRepository;

    public DashboardService(
            VendaRepository vendaRepository,
            MovimentacaoFinanceiraRepository movimentacaoRepository
    ) {
        this.vendaRepository = vendaRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    public DashboardResumoResponseDto obterResumo(String periodo, LocalDate dataInicio, LocalDate dataFim) {
        IntervaloDashboardDto intervalo = calcularIntervalo(periodo, dataInicio, dataFim);

        List<Venda> vendas = vendaRepository.findByDataVendaBetween(
                intervalo.getInicio(),
                intervalo.getFim()
        );

        List<PontoGraficoDto> faturamentoPorDia = criarSerie(intervalo);
        Map<String, Double> mapaCategorias = new HashMap<>();
        Map<String, Integer> mapaServicos = new HashMap<>();

        double faturamentoTotal = 0.0;
        double descontosTotal = 0.0;

        for (Venda venda : vendas) {
            double valorVenda = venda.getValorTotal() != null ? venda.getValorTotal() : 0.0;
            double valorDesconto = venda.getDesconto() != null ? venda.getDesconto() : 0.0;

            faturamentoTotal += valorVenda;
            descontosTotal += valorDesconto;

            adicionarValorNoGrafico(faturamentoPorDia, intervalo.isPorHora(), venda.getDataVenda(), valorVenda);

            if (venda.getItens() != null) {
                for (ItemVenda item : venda.getItens()) {
                    double subtotalItem = item.getSubtotal() != null ? item.getSubtotal() : 0.0;
                    int quantidade = item.getQuantidade() != null ? item.getQuantidade() : 0;

                    Produto produto = item.getProduto();
                    String categoria = (produto != null && produto.getCategoria() != null && !produto.getCategoria().isBlank())
                            ? produto.getCategoria()
                            : "Sem categoria";

                    String servico = obterNomeServico(produto);

                    double acumuladoCategoria = mapaCategorias.getOrDefault(categoria, 0.0);
                    mapaCategorias.put(categoria, acumuladoCategoria + subtotalItem);

                    int acumuladoServico = mapaServicos.getOrDefault(servico, 0);
                    mapaServicos.put(servico, acumuladoServico + quantidade);
                }
            }
        }

        List<MovimentacaoFinanceira> listaReceitas = movimentacaoRepository
                .findByTipoIgnoreCaseAndDataMovimentacaoBetween("RECEITA", intervalo.getInicio(), intervalo.getFim());
        List<MovimentacaoFinanceira> listaDespesas = movimentacaoRepository
                .findByTipoIgnoreCaseAndDataMovimentacaoBetween("DESPESA", intervalo.getInicio(), intervalo.getFim());

        double totalReceitas = somarMovimentacoes(listaReceitas);
        double totalDespesas = somarMovimentacoes(listaDespesas);
        double resultadoFinanceiro = totalReceitas - totalDespesas;
        double ticketMedio = vendas.isEmpty() ? 0.0 : faturamentoTotal / vendas.size();

        List<CategoriaValorDto> faturamentoPorCategoria = montarListaCategorias(mapaCategorias);
        List<ServicoRankingDto> servicosMaisVendidos = montarRankingServicos(mapaServicos);

        DashboardResumoResponseDto resumo = new DashboardResumoResponseDto();
        resumo.setIntervalo(intervalo);
        resumo.setFaturamento(faturamentoTotal);
        resumo.setVendas(vendas.size());
        resumo.setTicketMedio(ticketMedio);
        resumo.setDescontos(descontosTotal);
        resumo.setReceitas(totalReceitas);
        resumo.setDespesas(totalDespesas);
        resumo.setResultado(resultadoFinanceiro);
        resumo.setFaturamentoPorDia(faturamentoPorDia);
        resumo.setFaturamentoPorCategoria(faturamentoPorCategoria);
        resumo.setServicosMaisVendidos(servicosMaisVendidos);

        return resumo;
    }

    private String obterNomeServico(Produto produto) {
        if (produto == null) {
            return "Serviço não informado";
        }
        if (produto.getDescricao() != null && !produto.getDescricao().isBlank()) {
            return produto.getDescricao();
        }
        if (produto.getNome() != null && !produto.getNome().isBlank()) {
            return produto.getNome();
        }
        return "Serviço não informado";
    }

    public IntervaloDashboardDto calcularIntervalo(String periodo, LocalDate dataInicio, LocalDate dataFim) {
        if ("personalizado".equalsIgnoreCase(periodo)) {
            if (dataInicio == null || dataFim == null || dataFim.isBefore(dataInicio)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Informe um período personalizado válido."
                );
            }
            LocalDateTime inicio = dataInicio.atStartOfDay();
            LocalDateTime fim = dataFim.atTime(23, 59, 59);
            boolean porHora = dataInicio.isEqual(dataFim);
            return new IntervaloDashboardDto(inicio, fim, porHora);
        }

        int dias = 1;
        if ("30dias".equalsIgnoreCase(periodo)) {
            dias = 30;
        } else if ("7dias".equalsIgnoreCase(periodo)) {
            dias = 7;
        }

        LocalDate hoje = LocalDate.now();
        LocalDate diaInicial = hoje.minusDays(dias - 1);

        LocalDateTime inicio = diaInicial.atStartOfDay();
        LocalDateTime fim = hoje.atTime(23, 59, 59);
        boolean porHora = (dias == 1);

        return new IntervaloDashboardDto(inicio, fim, porHora);
    }

    private List<PontoGraficoDto> criarSerie(IntervaloDashboardDto intervalo) {
        List<PontoGraficoDto> pontos = new ArrayList<>();

        if (intervalo.isPorHora()) {
            String dataChave = intervalo.getInicio().toLocalDate().toString();
            for (int hora = 0; hora < 24; hora++) {
                String nomeHora = String.format("%02d:00", hora);
                String rotuloCompleto = dataChave + " " + nomeHora;
                pontos.add(new PontoGraficoDto(nomeHora, rotuloCompleto, 0.0, dataChave));
            }
            return pontos;
        }

        DateTimeFormatter formatadorCurto = DateTimeFormatter.ofPattern("dd/MM");
        Locale localeBr = Locale.forLanguageTag("pt-BR");
        DateTimeFormatter formatadorCompleto = DateTimeFormatter.ofPattern("EEEE, d 'de' MMMM 'de' yyyy", localeBr);

        LocalDate atual = intervalo.getInicio().toLocalDate();
        LocalDate dataFinal = intervalo.getFim().toLocalDate();

        while (!atual.isAfter(dataFinal)) {
            String nome = atual.format(formatadorCurto);
            String rotuloCompleto = atual.format(formatadorCompleto);
            String chave = atual.toString();
            pontos.add(new PontoGraficoDto(nome, rotuloCompleto, 0.0, chave));
            atual = atual.plusDays(1);
        }

        return pontos;
    }

    private void adicionarValorNoGrafico(
            List<PontoGraficoDto> pontos,
            boolean porHora,
            LocalDateTime dataVenda,
            double valorVenda
    ) {
        if (dataVenda == null) {
            return;
        }

        if (porHora) {
            int hora = dataVenda.getHour();
            if (hora >= 0 && hora < pontos.size()) {
                PontoGraficoDto ponto = pontos.get(hora);
                ponto.setValor(ponto.getValor() + valorVenda);
            }
            return;
        }

        String chaveDia = dataVenda.toLocalDate().toString();
        for (PontoGraficoDto ponto : pontos) {
            if (chaveDia.equals(ponto.getChave())) {
                ponto.setValor(ponto.getValor() + valorVenda);
                break;
            }
        }
    }

    private double somarMovimentacoes(List<MovimentacaoFinanceira> movimentacoes) {
        double soma = 0.0;
        for (MovimentacaoFinanceira mov : movimentacoes) {
            if (mov.getValor() != null) {
                soma += mov.getValor();
            }
        }
        return soma;
    }

    private List<CategoriaValorDto> montarListaCategorias(Map<String, Double> mapaCategorias) {
        List<CategoriaValorDto> lista = new ArrayList<>();
        for (Map.Entry<String, Double> entrada : mapaCategorias.entrySet()) {
            lista.add(new CategoriaValorDto(entrada.getKey(), entrada.getValue()));
        }
        lista.sort((a, b) -> Double.compare(b.getValor(), a.getValor()));
        return lista;
    }

    private List<ServicoRankingDto> montarRankingServicos(Map<String, Integer> mapaServicos) {
        List<Map.Entry<String, Integer>> entradas = new ArrayList<>(mapaServicos.entrySet());
        entradas.sort((a, b) -> Integer.compare(b.getValue(), a.getValue()));

        List<ServicoRankingDto> ranking = new ArrayList<>();
        int limite = Math.min(5, entradas.size());
        for (int i = 0; i < limite; i++) {
            Map.Entry<String, Integer> entrada = entradas.get(i);
            String id = entrada.getKey() + "-" + i;
            ranking.add(new ServicoRankingDto(id, entrada.getKey(), entrada.getValue()));
        }
        return ranking;
    }
}
