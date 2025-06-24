package com.example.crud_app.dto;

import com.example.crud_app.enums.Role;

public record CreateUserDTO(
        String username,
        String password,
        Role role
) {}
