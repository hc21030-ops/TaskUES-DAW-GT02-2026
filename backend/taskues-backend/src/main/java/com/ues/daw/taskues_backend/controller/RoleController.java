package com.ues.daw.taskues_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

import com.ues.daw.taskues_backend.dto.RoleDTO;
import com.ues.daw.taskues_backend.service.RoleService;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Roles", description = "Operaciones relacionadas con la gestión de roles de usuario")
public class RoleController {

    private final RoleService roleservice;

    @GetMapping
    @Operation(summary = "Listar todos los roles", description = "Retorna una lista completa de los roles registrados en la base de datos.")
    public List<RoleDTO> listar() {
        return roleservice.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear nuevo rol", description = "Crea un nuevo rol en el sistema.")
    public RoleDTO save(@RequestBody RoleDTO roleDTO) {
        return roleservice.save(roleDTO);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Actualizar rol", description = "Modifica la información de un rol existente.")
    public RoleDTO update(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        return roleservice.update(id, roleDTO);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar rol", description = "Elimina un rol existente del sistema.")
    public void delete(@PathVariable Long id) {
        roleservice.deleteById(id);
    }

}
