package school.sptech.glic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import school.sptech.glic.dto.LancamentoFinanceiroRequestDto;
import school.sptech.glic.dto.LancamentoFinanceiroResponseDto;
import school.sptech.glic.service.FinanceiroService;

import java.util.List;

@RestController
@RequestMapping("/financeiro")
@CrossOrigin(origins = "*")
@Tag(name = "Financeiro", description = "Endpoints para consulta e cadastro de receitas e despesas")
public class FinanceiroController {

    private final FinanceiroService financeiroService;

    public FinanceiroController(FinanceiroService financeiroService) {
        this.financeiroService = financeiroService;
    }

    @GetMapping("/receitas")
    @Operation(summary = "Listar receitas", description = "Retorna todas as receitas ordenadas da mais recente para a mais antiga.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de receitas retornada com sucesso"),
            @ApiResponse(responseCode = "204", description = "Nenhuma receita encontrada")
    })
    public ResponseEntity<List<LancamentoFinanceiroResponseDto>> listarReceitas() {
        List<LancamentoFinanceiroResponseDto> receitas = financeiroService.listarReceitas();
        if (receitas.isEmpty()) {
            return ResponseEntity.status(204).build();
        }
        return ResponseEntity.status(200).body(receitas);
    }

    @GetMapping("/despesas")
    @Operation(summary = "Listar despesas", description = "Retorna todas as despesas ordenadas da mais recente para a mais antiga.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de despesas retornada com sucesso"),
            @ApiResponse(responseCode = "204", description = "Nenhuma despesa encontrada")
    })
    public ResponseEntity<List<LancamentoFinanceiroResponseDto>> listarDespesas() {
        List<LancamentoFinanceiroResponseDto> despesas = financeiroService.listarDespesas();
        if (despesas.isEmpty()) {
            return ResponseEntity.status(204).build();
        }
        return ResponseEntity.status(200).body(despesas);
    }

    @PostMapping("/receitas")
    @Operation(summary = "Cadastrar receita", description = "Registra um novo lançamento de receita na tabela movimentacao_financeira.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Receita cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<LancamentoFinanceiroResponseDto> cadastrarReceita(@Valid @RequestBody LancamentoFinanceiroRequestDto dto) {
        LancamentoFinanceiroResponseDto salva = financeiroService.cadastrarReceita(dto);
        return ResponseEntity.status(201).body(salva);
    }

    @PostMapping("/despesas")
    @Operation(summary = "Cadastrar despesa", description = "Registra um novo lançamento de despesa nas tabelas movimentacao_financeira e despesa.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Despesa cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<LancamentoFinanceiroResponseDto> cadastrarDespesa(@Valid @RequestBody LancamentoFinanceiroRequestDto dto) {
        LancamentoFinanceiroResponseDto salva = financeiroService.cadastrarDespesa(dto);
        return ResponseEntity.status(201).body(salva);
    }
}
