package com.example.crud_app.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for creating new categories
 */
public record CategoryCreateDTO(
        @NotBlank(message = "Category name is required")
        String name,
        String description
) {}
