package com.ues.daw.taskues_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {

    private Long taskId;

    @NotBlank(message = "El título de la tarea es obligatorio")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    private LocalDateTime initDate;
    private LocalDateTime endDate;
    private String state;

    @NotNull(message = "La tarea debe pertenecer a un proyecto")
    private Long projectId;

    @NotNull(message = "La tarea debe tener una categoría")
    private Integer categoryId;

    @NotNull(message = "La tarea debe tener un usuario asignado")
    private Long userId;

    private String assignedUserName;
    private String assignedUserEmail;
    private LocalDateTime dateCreated;
    private LocalDateTime dateUpdate;
}
