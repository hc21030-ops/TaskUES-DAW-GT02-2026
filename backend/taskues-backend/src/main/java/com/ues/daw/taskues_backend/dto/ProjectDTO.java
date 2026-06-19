package com.ues.daw.taskues_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {

    private Long projectId;

    @NotBlank(message = "El nombre del proyecto es obligatorio")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    private String state;

    @NotNull(message = "El proyecto debe tener un propietario (owner_id)")
    private Long ownerId;

    private LocalDateTime dateCreated;
}
