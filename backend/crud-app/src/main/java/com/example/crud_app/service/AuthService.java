package com.example.crud_app.service;

import com.example.crud_app.dto.LoginDTO;
import com.example.crud_app.dto.AuthResponse;
import com.example.crud_app.exception.InvalidCredentialsException;

public interface AuthService {
    AuthResponse authenticate(LoginDTO loginDTO) throws InvalidCredentialsException;
}