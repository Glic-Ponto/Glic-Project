package school.sptech.glic;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import school.sptech.glic.dto.DashboardResumoResponseDto;
import school.sptech.glic.service.DashboardService;
import school.sptech.glic.service.FinanceiroService;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class GlicApplicationTests {

	@Autowired
	private DashboardService dashboardService;

	@Autowired
	private FinanceiroService financeiroService;

	@Test
	void contextLoadsAndDashboardCalculaIndicadoresCorretamente() {
		DashboardResumoResponseDto resumoHoje = dashboardService.obterResumo("hoje", null, null);
		assertNotNull(resumoHoje);
		assertTrue(resumoHoje.getIntervalo().isPorHora());
		assertEquals(24, resumoHoje.getFaturamentoPorDia().size());
		assertTrue(resumoHoje.getVendas() >= 2);
		assertTrue(resumoHoje.getFaturamento() > 0);

		DashboardResumoResponseDto resumo30Dias = dashboardService.obterResumo("30dias", null, null);
		assertNotNull(resumo30Dias);
		assertFalse(resumo30Dias.getIntervalo().isPorHora());
		assertEquals(30, resumo30Dias.getFaturamentoPorDia().size());
		assertTrue(resumo30Dias.getVendas() >= 5);

		LocalDate hoje = LocalDate.now();
		DashboardResumoResponseDto resumoPersonalizado = dashboardService.obterResumo(
				"personalizado",
				hoje.minusDays(7),
				hoje
		);
		assertNotNull(resumoPersonalizado);
		assertFalse(resumoPersonalizado.getIntervalo().isPorHora());

		assertFalse(financeiroService.listarReceitas().isEmpty());
		assertFalse(financeiroService.listarDespesas().isEmpty());
	}

}
