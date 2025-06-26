package com.example.crud_app.dto;

public record AuthResponse(
        String token,
        String username
) {}