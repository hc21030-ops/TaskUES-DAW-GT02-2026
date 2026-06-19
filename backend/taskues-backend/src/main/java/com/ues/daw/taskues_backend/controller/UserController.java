package com.ues.daw.taskues_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ues.daw.taskues_backend.dto.UserDTO;
import com.ues.daw.taskues_backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Operaciones relacionadas con la gestión de perfiles de usuario")
public class UserController {

    private final UserService service;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios", description = "Retorna una lista completa de usuarios registrados en la base de datos.")
    public List<UserDTO> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Busca un usuario específico utilizando su identificador único.")
    public UserDTO obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Modifica la información de un usuario existente. El ID debe coincidir con un registro activo.")
    public UserDTO actualizar(
            @PathVariable Long id,
            @RequestBody UserDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar usuario", description = "Elimina permanentemente el registro del usuario de la base de datos.")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }
}