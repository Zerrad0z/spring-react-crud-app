package com.example.crud_app.dto;

/**
 * Basic Category DTO for read operations
**/
public record CategoryDTO(
   Long id,
   String name,
   String description
) {}

