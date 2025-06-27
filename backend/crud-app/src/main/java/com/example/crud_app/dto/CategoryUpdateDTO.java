package com.example.crud_app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for updating existing categories
 */
public record CategoryUpdateDTO(
        @NotBlank(message = "Category name is required")
        @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Category name must contain only letters and spaces")
        String name,
        String description
) {}
