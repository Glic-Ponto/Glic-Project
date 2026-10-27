package school.sptech.glic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import school.sptech.glic.dto.ProdutoRequestDto;
import school.sptech.glic.dto.ProdutoResponseDto;
import school.sptech.glic.service.ProdutoService;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
@Tag(name = "Produtos", description = "Endpoints de cadastro e consulta de produtos do estoque")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    @Operation(summary = "Listar produtos", description = "Retorna todos os produtos cadastrados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de produtos retornada com sucesso")
    })
    public ResponseEntity<List<ProdutoResponseDto>> listar() {
        return ResponseEntity.ok(produtoService.listar());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto pelo id", description = "Retorna os dados de um produto específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produto encontrado"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    public ResponseEntity<ProdutoResponseDto> buscar(
            @Parameter(description = "Identificador do produto", example = "1")
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(produtoService.buscar(id));
    }

    @PostMapping
    @Operation(summary = "Cadastrar produto", description = "Cadastra um novo produto ativo no estoque a partir dos dados enviados no corpo da requisição.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produto cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados do produto inválidos")
    })
    public ResponseEntity<ProdutoResponseDto> cadastrar(@Valid @RequestBody ProdutoRequestDto dto) {
        return ResponseEntity.status(201).body(produtoService.cadastrar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produto", description = "Atualiza todos os dados de um produto existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados do produto inválidos"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    public ResponseEntity<ProdutoResponseDto> atualizar(
            @Parameter(description = "Identificador do produto", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody ProdutoRequestDto dto
    ) {
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }
}
