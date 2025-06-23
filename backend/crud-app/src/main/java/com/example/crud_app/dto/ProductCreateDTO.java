package com.example.crud_app.dto;

import java.math.BigDecimal;

/**
 * DTO for creating new produtcs
 */
public record ProductCreateDTO(
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        Long categoryId
) {}
