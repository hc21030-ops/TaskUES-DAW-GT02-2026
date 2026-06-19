package com.ues.daw.taskues_backend.service;

import com.ues.daw.taskues_backend.dto.TaskDTO;
import com.ues.daw.taskues_backend.entity.Task;
import com.ues.daw.taskues_backend.entity.TaskState;
import com.ues.daw.taskues_backend.entity.User;
import com.ues.daw.taskues_backend.exception.BusinessException;
import com.ues.daw.taskues_backend.exception.ResourceNotFoundException;
import com.ues.daw.taskues_backend.repository.CategoryRepository;
import com.ues.daw.taskues_backend.repository.ProjectRepository;
import com.ues.daw.taskues_backend.repository.TaskRepository;
import com.ues.daw.taskues_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    private TaskDTO toDTO(Task task) {
        User assignedUser = userRepository.findById(task.getUserId()).orElse(null);

        return TaskDTO.builder()
                .taskId(task.getTaskId())
                .title(task.getTitle())
                .description(task.getDescription())
                .initDate(task.getInitDate())
                .endDate(task.getEndDate())
                .state(task.getState().name())
                .projectId(task.getProjectId())
                .categoryId(task.getCategoryId())
                .userId(task.getUserId())
                .assignedUserName(assignedUser != null
                        ? assignedUser.getName() + " " + assignedUser.getLastname() : null)
                .assignedUserEmail(assignedUser != null ? assignedUser.getEmail() : null)
                .dateCreated(task.getDateCreated())
                .dateUpdate(task.getDateUpdate())
                .build();
    }

    private TaskState parseState(String state) {
        if (state == null || state.isBlank()) return TaskState.TODO;
        try {
            return TaskState.valueOf(state.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(
                    "Estado de tarea inválido: '" + state + "'. Valores permitidos: TODO, IN_PROGRESS, IN_REVIEW, DONE");
        }
    }

    public List<TaskDTO> findByProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Proyecto con id " + projectId + " no encontrado");
        }
        return taskRepository.findByProjectId(projectId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TaskDTO> findByProjectAndState(Long projectId, String state) {
        return taskRepository.findByProjectIdAndState(projectId, parseState(state))
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TaskDTO> findByUser(Long userId) {
        return taskRepository.findByUserId(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TaskDTO findById(Long id) {
        return taskRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea con id " + id + " no encontrada"));
    }

    public TaskDTO save(TaskDTO dto) {
        if (!projectRepository.existsById(dto.getProjectId())) {
            throw new ResourceNotFoundException("Proyecto con id " + dto.getProjectId() + " no encontrado");
        }
        if (!userRepository.existsById(dto.getUserId())) {
            throw new ResourceNotFoundException("Usuario con id " + dto.getUserId() + " no encontrado");
        }
        if (!categoryRepository.existsById(dto.getCategoryId())) {
            throw new ResourceNotFoundException("Categoría con id " + dto.getCategoryId() + " no encontrada");
        }

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .initDate(dto.getInitDate())
                .endDate(dto.getEndDate())
                .state(parseState(dto.getState()))
                .projectId(dto.getProjectId())
                .categoryId(dto.getCategoryId())
                .userId(dto.getUserId())
                .build();

        return toDTO(taskRepository.save(task));
    }

    public TaskDTO update(Long id, TaskDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea con id " + id + " no encontrada"));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setInitDate(dto.getInitDate());
        task.setEndDate(dto.getEndDate());

        if (dto.getState() != null && !dto.getState().isBlank()) {
            task.setState(parseState(dto.getState()));
        }
        if (dto.getUserId() != null) {
            if (!userRepository.existsById(dto.getUserId())) {
                throw new ResourceNotFoundException("Usuario con id " + dto.getUserId() + " no encontrado");
            }
            task.setUserId(dto.getUserId());
        }
        if (dto.getCategoryId() != null) {
            task.setCategoryId(dto.getCategoryId());
        }

        return toDTO(taskRepository.save(task));
    }

    public TaskDTO moveToState(Long id, String newState) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea con id " + id + " no encontrada"));
        task.setState(parseState(newState));
        return toDTO(taskRepository.save(task));
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tarea con id " + id + " no encontrada");
        }
        taskRepository.deleteById(id);
    }
}
