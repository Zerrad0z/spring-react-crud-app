package com.example.crud_app.dto;

import com.example.crud_app.enums.Role;

public record UserDTO(
        Long id,
        String username,
        Role role
) {}
