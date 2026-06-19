package com.ues.daw.taskues_backend.service;

import com.ues.daw.taskues_backend.dto.ProjectUserDTO;
import com.ues.daw.taskues_backend.entity.Project;
import com.ues.daw.taskues_backend.entity.ProjectRole;
import com.ues.daw.taskues_backend.entity.ProjectUser;
import com.ues.daw.taskues_backend.entity.User;
import com.ues.daw.taskues_backend.exception.BusinessException;
import com.ues.daw.taskues_backend.exception.ResourceNotFoundException;
import com.ues.daw.taskues_backend.repository.ProjectRepository;
import com.ues.daw.taskues_backend.repository.ProjectUserRepository;
import com.ues.daw.taskues_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectUserService {

    private final ProjectUserRepository repository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private ProjectUserDTO toDTO(ProjectUser pu) {
        User user = userRepository.findById(pu.getUserId()).orElse(null);

        return ProjectUserDTO.builder()
                .id(pu.getId())
                .projectId(pu.getProjectId())
                .userId(pu.getUserId())
                .userName(user != null ? user.getName() + " " + user.getLastname() : null)
                .userEmail(user != null ? user.getEmail() : null)
                .projectRole(pu.getProjectRole().name())
                .build();
    }

    private ProjectRole parseRole(String role) {
        if (role == null || role.isBlank()) {
            return ProjectRole.MEMBER;
        }
        try {
            return ProjectRole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(
                    "Rol de proyecto inválido: '" + role + "'. Valores permitidos: OWNER, ADMIN, MEMBER, VIEWER");
        }
    }

    public List<ProjectUserDTO> findByProjectId(Long projectId) {
        return repository.findByProjectId(projectId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProjectUserDTO addMember(ProjectUserDTO dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto con id " + dto.getProjectId() + " no encontrado"));

        if (!userRepository.existsById(dto.getUserId())) {
            throw new ResourceNotFoundException("Usuario con id " + dto.getUserId() + " no encontrado");
        }

        if (repository.existsByProjectIdAndUserId(dto.getProjectId(), dto.getUserId())) {
            throw new BusinessException("El usuario ya es miembro de este proyecto");
        }

        ProjectUser nuevo = ProjectUser.builder()
                .projectId(project.getProjectId())
                .userId(dto.getUserId())
                .projectRole(parseRole(dto.getProjectRole()))
                .build();

        return toDTO(repository.save(nuevo));
    }

    public ProjectUserDTO updateRole(Long projectUserId, String nuevoRol) {
        ProjectUser pu = repository.findById(projectUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Membresía con id " + projectUserId + " no encontrada"));

        pu.setProjectRole(parseRole(nuevoRol));
        return toDTO(repository.save(pu));
    }

    public void removeMember(Long projectUserId) {
        ProjectUser pu = repository.findById(projectUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Membresía con id " + projectUserId + " no encontrada"));

        if (pu.getProjectRole() == ProjectRole.OWNER) {
            throw new BusinessException("No se puede quitar al propietario (OWNER) del proyecto");
        }

        repository.deleteById(projectUserId);
    }
}
