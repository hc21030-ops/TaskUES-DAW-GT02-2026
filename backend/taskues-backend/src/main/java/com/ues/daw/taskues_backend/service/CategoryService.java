package com.ues.daw.taskues_backend.service;

import com.ues.daw.taskues_backend.dto.CategoryDTO;
import com.ues.daw.taskues_backend.entity.Category;
import com.ues.daw.taskues_backend.exception.ResourceNotFoundException;
import com.ues.daw.taskues_backend.repository.CategoryRepository;
import com.ues.daw.taskues_backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final ProjectRepository projectRepository;

    private CategoryDTO toDTO(Category c) {
        return CategoryDTO.builder()
                .categoryId(c.getCategoryId())
                .name(c.getName())
                .color(c.getColor())
                .projectId(c.getProjectId())
                .build();
    }

    public List<CategoryDTO> findByProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Proyecto con id " + projectId + " no encontrado");
        }
        return repository.findByProjectId(projectId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CategoryDTO findById(Integer id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con id " + id + " no encontrada"));
    }

    public CategoryDTO save(CategoryDTO dto) {
        if (!projectRepository.existsById(dto.getProjectId())) {
            throw new ResourceNotFoundException("Proyecto con id " + dto.getProjectId() + " no encontrado");
        }
        Category category = Category.builder()
                .name(dto.getName())
                .color(dto.getColor())
                .projectId(dto.getProjectId())
                .build();
        return toDTO(repository.save(category));
    }

    public CategoryDTO update(Integer id, CategoryDTO dto) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con id " + id + " no encontrada"));
        category.setName(dto.getName());
        category.setColor(dto.getColor());
        return toDTO(repository.save(category));
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría con id " + id + " no encontrada");
        }
        repository.deleteById(id);
    }
}