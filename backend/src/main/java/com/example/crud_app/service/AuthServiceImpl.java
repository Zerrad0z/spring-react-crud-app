package com.example.crud_app.service;

import com.example.crud_app.dto.LoginDTO;
import com.example.crud_app.dto.AuthResponse;
import com.example.crud_app.entity.User;
import com.example.crud_app.exception.InvalidCredentialsException;
import com.example.crud_app.repository.UserRepository;
import com.example.crud_app.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public AuthResponse authenticate(LoginDTO loginDTO) throws InvalidCredentialsException {
        // 1. Find user by username
        User user = userRepository.findByUsername(loginDTO.username())
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        // 2. Validate password
        if (!passwordEncoder.matches(loginDTO.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // 3. Generate JWT token with role
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        // 4. Return response DTO with role
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}