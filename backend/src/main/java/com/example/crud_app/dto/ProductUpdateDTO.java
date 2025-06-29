package com.example.crud_app.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

/**
 * DTO for updating existing products
 */
public record ProductUpdateDTO(
        @NotBlank(message = "Product name is required")
        String name,
        @NotBlank(message = "Price is required")
        BigDecimal price,
        @NotBlank(message = "Category is required")
        Long categoryId
) {}
