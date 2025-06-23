package com.example.crud_app.dto;

import java.math.BigDecimal;

/**
 * Product DTO for read operations
 */
public record ProductDTO(
        Long id,
        String name,
        BigDecimal price,
        String imageUrl,
        Long categoryId,
        String categoryName
) {}
