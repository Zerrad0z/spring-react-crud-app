package com.example.crud_app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Extended Category DTO that includes associated products
 */
public record CategoryWithProductsDTO(
        Long id,
        String name,
        String description,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        List<ProductDTO> products
) {}
