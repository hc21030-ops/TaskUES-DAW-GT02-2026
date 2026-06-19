package com.ues.daw.taskues_backend.controller;


import com.ues.daw.taskues_backend.dto.ProjectUserDTO;
import com.ues.daw.taskues_backend.service.ProjectUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-users")
@RequiredArgsConstructor
@Tag(name = "Miembros de Proyecto", description = "Gestión de los usuarios que participan en un proyecto y su rol dentro de él")
public class ProjectUserController {

    private final ProjectUserService service;

    @GetMapping("/proyecto/{projectId}")
    @Operation(summary = "Listar miembros de un proyecto", description = "Retorna todos los usuarios que pertenecen a un proyecto, junto con su rol.")
    public List<ProjectUserDTO> listByProject(@PathVariable Long projectId) {
        return service.findByProjectId(projectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Agregar miembro a un proyecto", description = "Agrega un usuario existente a un proyecto con el rol indicado (OWNER, ADMIN, MEMBER, VIEWER).")
    public ProjectUserDTO create(@Valid @RequestBody ProjectUserDTO dto) {
        return service.addMember(dto);
    }

    @PutMapping("/{id}/rol")
    @Operation(summary = "Cambiar el rol de un miembro", description = "Actualiza el rol de un miembro ya existente dentro del proyecto.")
    public ProjectUserDTO changeRol(@PathVariable Long id, @RequestParam String rol) {
        return service.updateRole(id, rol);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Quitar miembro de un proyecto", description = "Elimina la membresía de un usuario en un proyecto. No permite quitar al OWNER.")
    public void remove(@PathVariable Long id) {
        service.removeMember(id);
    }
}
