package com.example.crud_app.dto;

import com.example.crud_app.enums.Role;

public record UpdateUserDTO(
        String username,
        Role role
) {}
