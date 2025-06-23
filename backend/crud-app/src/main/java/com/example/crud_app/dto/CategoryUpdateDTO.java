package com.example.crud_app.dto;

/**
 * DTO for updating existing categories
 */
public record CategoryUpdateDTO(
        String name,
        String description
) {}
