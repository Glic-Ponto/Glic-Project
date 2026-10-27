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
import school.sptech.glic.dto.VendaRequestDto;
import school.sptech.glic.dto.VendaResponseDto;
import school.sptech.glic.service.VendaService;

import java.util.List;

@RestController
@RequestMapping("/vendas")
@CrossOrigin(origins = "*")
@Tag(name = "Vendas", description = "Endpoints para registro e consulta de vendas que alimentam o Dashboard")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @GetMapping
    @Operation(summary = "Listar vendas", description = "Retorna todas as vendas cadastradas ordenadas pela data.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de vendas retornada com sucesso"),
            @ApiResponse(responseCode = "204", description = "Nenhuma venda encontrada")
    })
    public ResponseEntity<List<VendaResponseDto>> listarVendas() {
        List<VendaResponseDto> vendas = vendaService.listarVendas();
        if (vendas.isEmpty()) {
            return ResponseEntity.status(204).build();
        }
        return ResponseEntity.status(200).body(vendas);
    }

    @PostMapping
    @Operation(summary = "Registrar venda", description = "Registra uma venda com seus itens e gera automaticamente a receita correspondente se estiver finalizada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Venda registrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados da venda inválidos")
    })
    public ResponseEntity<VendaResponseDto> registrarVenda(@Valid @RequestBody VendaRequestDto dto) {
        VendaResponseDto salva = vendaService.registrarVenda(dto);
        return ResponseEntity.status(201).body(salva);
    }
}
