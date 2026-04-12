import com.ues.daw.taskues_backend.dto.UserDTO;
import com.ues.daw.taskues_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "API para la gestión de usuarios")
public class UserController {

    private final UserService service;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public List<UserDTO> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario por ID")
    public UserDTO obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un nuevo usuario")
    public UserDTO crear(
            @RequestBody UserDTO dto,
            @RequestParam String password) {
        return service.save(dto, password);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un usuario")
    public UserDTO actualizar(
            @PathVariable Long id,
            @RequestBody UserDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un usuario")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}
