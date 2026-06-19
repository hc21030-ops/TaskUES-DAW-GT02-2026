package com.ues.daw.taskues_backend.service;


import com.ues.daw.taskues_backend.dto.ProjectDTO;
import com.ues.daw.taskues_backend.entity.Project;
import com.ues.daw.taskues_backend.entity.ProjectRole;
import com.ues.daw.taskues_backend.entity.ProjectState;
import com.ues.daw.taskues_backend.entity.ProjectUser;
import com.ues.daw.taskues_backend.exception.BusinessException;
import com.ues.daw.taskues_backend.exception.ResourceNotFoundException;
import com.ues.daw.taskues_backend.repository.ProjectRepository;
import com.ues.daw.taskues_backend.repository.ProjectUserRepository;
import com.ues.daw.taskues_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;
    private final ProjectUserRepository projectUserRepository;
    private final UserRepository userRepository;

    private ProjectDTO toDTO(Project project) {
        return ProjectDTO.builder()
                .projectId(project.getProjectId())
                .name(project.getName())
                .description(project.getDescription())
                .state(project.getState().name())
                .ownerId(project.getOwnerId())
                .dateCreated(project.getDateCreated())
                .build();
    }

    private ProjectState parseState(String state) {
        if (state == null || state.isBlank()) {
            return ProjectState.ACTIVE;
        }
        try {
            return ProjectState.valueOf(state.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(
                    "Estado de proyecto inválido: '" + state + "'. Valores permitidos: ACTIVE, ARCHIVED, COMPLETED");
        }
    }

    public List<ProjectDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> findByUserId(Long userId) {
        List<Long> projectIds = projectUserRepository.findByUserId(userId)
                .stream()
                .map(ProjectUser::getProjectId)
                .distinct()
                .toList();

        return repository.findAllById(projectIds)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO findById(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto con id " + id + " no encontrado"));
    }

    @Transactional
    public ProjectDTO save(ProjectDTO dto) {
        if (!userRepository.existsById(dto.getOwnerId())) {
            throw new ResourceNotFoundException("El usuario owner_id " + dto.getOwnerId() + " no existe");
        }

        Project project = Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .state(parseState(dto.getState()))
                .ownerId(dto.getOwnerId())
                .build();

        Project saved = repository.save(project);

        ProjectUser ownerMembership = ProjectUser.builder()
                .projectId(saved.getProjectId())
                .userId(dto.getOwnerId())
                .projectRole(ProjectRole.OWNER)
                .build();
        projectUserRepository.save(ownerMembership);

        return toDTO(saved);
    }

    public ProjectDTO update(Long id, ProjectDTO dto) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto con id " + id + " no encontrado"));

        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        if (dto.getState() != null && !dto.getState().isBlank()) {
            project.setState(parseState(dto.getState()));
        }

        return toDTO(repository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Proyecto con id " + id + " no encontrado");
        }
        repository.deleteById(id);
    }
}
