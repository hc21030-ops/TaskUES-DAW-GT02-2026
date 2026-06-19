package com.ues.daw.taskues_backend.controller;

import com.ues.daw.taskues_backend.dto.ProjectDTO;
import com.ues.daw.taskues_backend.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Proyectos", description = "Gestión de proyectos: creación, consulta, actualización y eliminación")
public class ProjectController {

    private final ProjectService service;

    @GetMapping
    @Operation(summary = "Listar todos los proyectos", description = "Retorna todos los proyectos registrados. Útil para administración; para un usuario normal usar /usuario/{userId}.")
    public List<ProjectDTO> list() {
        return service.findAll();
    }

    @GetMapping("/usuario/{userId}")
    @Operation(summary = "Listar proyectos de un usuario", description = "Retorna los proyectos donde el usuario participa (como owner o como miembro).")
    public List<ProjectDTO> listByUser(@PathVariable Long userId) {
        return service.findByUserId(userId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener proyecto por ID")
    public ProjectDTO getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear proyecto", description = "Crea un nuevo proyecto. El usuario indicado en owner_id queda registrado automáticamente como miembro con rol OWNER.")
    public ProjectDTO create(@Valid @RequestBody ProjectDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar proyecto", description = "Modifica nombre, descripción o estado de un proyecto existente.")
    public ProjectDTO update(@PathVariable Long id, @Valid @RequestBody ProjectDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar proyecto", description = "Elimina el proyecto y, en cascada, sus categorías, tags, miembros y tareas asociadas.")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
