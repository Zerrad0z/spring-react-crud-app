package com.example.crud_app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

/**
 * DTO for updating existing products
 */
public record ProductUpdateDTO(
        @NotBlank(message = "Product name is required")
        String name,
        BigDecimal price,
        Long categoryId
) {}
