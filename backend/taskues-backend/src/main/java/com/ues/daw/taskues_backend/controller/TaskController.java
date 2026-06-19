package com.ues.daw.taskues_backend.controller;

import com.ues.daw.taskues_backend.dto.TaskDTO;
import com.ues.daw.taskues_backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tareas", description = "Gestión de tareas del tablero Kanban")
public class TaskController {

    private final TaskService service;

    @GetMapping("/proyecto/{projectId}")
    @Operation(summary = "Listar todas las tareas de un proyecto",
            description = "Retorna todas las tareas del proyecto para construir el tablero Kanban.")
    public List<TaskDTO> listByProject(@PathVariable Long projectId) {
        return service.findByProject(projectId);
    }

    @GetMapping("/proyecto/{projectId}/estado/{state}")
    @Operation(summary = "Listar tareas de un proyecto por estado (columna Kanban)")
    public List<TaskDTO> listByState(
            @PathVariable Long projectId,
            @PathVariable String state) {
        return service.findByProjectAndState(projectId, state);
    }

    @GetMapping("/usuario/{userId}")
    @Operation(summary = "Listar tareas asignadas a un usuario",
            description = "Útil para el dashboard personal del usuario.")
    public List<TaskDTO> listByUser(@PathVariable Long userId) {
        return service.findByUser(userId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener tarea por ID")
    public TaskDTO getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear tarea")
    public TaskDTO create(@Valid @RequestBody TaskDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar tarea completa")
    public TaskDTO update(@PathVariable Long id, @Valid @RequestBody TaskDTO dto) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Mover tarea a otro estado (drag & drop Kanban)",
            description = "Actualiza solo el estado de la tarea. Ideal para drag & drop en el tablero.")
    public TaskDTO moveState(@PathVariable Long id, @RequestParam String estado) {
        return service.moveToState(id, estado);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar tarea")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
