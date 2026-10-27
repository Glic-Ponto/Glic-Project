package school.sptech.glic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import school.sptech.glic.dto.DashboardResumoResponseDto;
import school.sptech.glic.service.DashboardService;

import java.time.LocalDate;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
@Tag(name = "Dashboard", description = "Endpoints de indicadores, gráficos e resumo financeiro do Dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumo")
    @Operation(summary = "Obter resumo do Dashboard", description = "Retorna os KPIs, gráficos de faturamento, ranking de serviços e totais financeiros conforme o período selecionado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Resumo do Dashboard retornado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Período personalizado inválido")
    })
    public ResponseEntity<DashboardResumoResponseDto> obterResumo(
            @Parameter(description = "Período do resumo: hoje, 7dias, 30dias ou personalizado", example = "hoje")
            @RequestParam(defaultValue = "hoje") String periodo,
            @Parameter(description = "Data inicial (yyyy-MM-dd). Obrigatória quando o período é personalizado", example = "2026-10-01")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @Parameter(description = "Data final (yyyy-MM-dd). Obrigatória quando o período é personalizado e não pode ser anterior à inicial", example = "2026-10-27")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) {
        DashboardResumoResponseDto resumo = dashboardService.obterResumo(periodo, inicio, fim);
        return ResponseEntity.status(200).body(resumo);
    }
}
