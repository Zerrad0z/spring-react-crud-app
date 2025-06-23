package com.example.crud_app.dto;

/**
 * DTO for creating new categories
 */
public record CategoryCreateDTO(
        String name,
        String description
) {}
