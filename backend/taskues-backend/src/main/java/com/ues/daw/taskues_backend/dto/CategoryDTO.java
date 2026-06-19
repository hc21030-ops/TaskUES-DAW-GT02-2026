package com.ues.daw.taskues_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {

    private Integer categoryId;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    private String name;

    @NotBlank(message = "El color es obligatorio (formato hex: #RRGGBB)")
    private String color;

    @NotNull(message = "La categoría debe pertenecer a un proyecto")
    private Long projectId;
}
