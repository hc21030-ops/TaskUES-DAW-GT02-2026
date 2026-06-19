package com.ues.daw.taskues_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDTO {

    private Long roleId;
    private String name;
    private String description;
}
