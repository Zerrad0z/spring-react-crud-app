package com.example.crud_app.dto;

import java.math.BigDecimal;

/**
 * DTO for updating existing products
 */
public record ProductUpdateDTO(
        String name,
        BigDecimal price,
        Long categoryId
) {}
