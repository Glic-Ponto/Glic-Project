package school.sptech.glic.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API GLIC - Oficina DSom",
                version = "1.0",
                description = "API de gestão da oficina: usuários, produtos/estoque, vendas, financeiro e dashboard"
        )
)
public class OpenApiConfig {
}
