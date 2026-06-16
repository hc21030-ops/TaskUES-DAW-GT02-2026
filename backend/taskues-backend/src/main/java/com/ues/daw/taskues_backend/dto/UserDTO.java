package com.ues.daw.taskues_backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long userId;
    private String name;
    private String lastname;
    private String email;
    private Boolean state;
    private LocalDateTime dateCreated;
    private LocalDateTime lastAccess;
    private Set<String> roles;
}