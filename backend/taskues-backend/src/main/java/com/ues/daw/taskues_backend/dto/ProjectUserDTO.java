package com.ues.daw.taskues_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectUserDTO {

    private Long id;

    @NotNull(message = "El proyecto es obligatorio")
    private Long projectId;

    @NotNull(message = "El usuario es obligatorio")
    private Long userId;

    private String userName;
    private String userEmail;

    private String projectRole;
}
