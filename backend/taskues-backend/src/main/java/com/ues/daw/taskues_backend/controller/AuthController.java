package com.ues.daw.taskues_backend.controller;


import com.ues.daw.taskues_backend.dto.LoginDTO;
import com.ues.daw.taskues_backend.dto.RegisterDTO;
import com.ues.daw.taskues_backend.dto.UserDTO;
import com.ues.daw.taskues_backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Registro e inicio de sesión de usuarios")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar nuevo usuario", description = "Crea una cuenta nueva con el rol USER por defecto. La contraseña se almacena cifrada con BCrypt.")
    public UserDTO register(@Valid @RequestBody RegisterDTO dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Valida email y contraseña. Por ahora retorna los datos del usuario directamente (sin token); el manejo de sesión se decidirá en una fase posterior.")
    public UserDTO login(@Valid @RequestBody LoginDTO dto) {
        return authService.login(dto);
    }
}