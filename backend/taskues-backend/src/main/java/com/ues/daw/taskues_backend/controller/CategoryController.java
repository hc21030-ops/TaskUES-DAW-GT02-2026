package com.ues.daw.taskues_backend.controller;

import com.ues.daw.taskues_backend.dto.CategoryDTO;
import com.ues.daw.taskues_backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categorías", description = "Gestión de categorías por proyecto")
public class CategoryController {

    private final CategoryService service;

    @GetMapping("/proyecto/{projectId}")
    @Operation(summary = "Listar categorías de un proyecto")
    public List<CategoryDTO> listByProject(@PathVariable Long projectId) {
        return service.findByProject(projectId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID")
    public CategoryDTO getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear categoría")
    public CategoryDTO create(@Valid @RequestBody CategoryDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoría")
    public CategoryDTO update(@PathVariable Integer id, @Valid @RequestBody CategoryDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar categoría")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}