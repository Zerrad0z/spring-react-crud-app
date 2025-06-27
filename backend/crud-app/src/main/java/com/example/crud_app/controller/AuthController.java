package com.example.crud_app.controller;

import com.example.crud_app.dto.AuthResponse;
import com.example.crud_app.dto.LoginDTO;
import com.example.crud_app.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO) {
        // Debug logging
        log.info("Received login request:");
        log.info("LoginDTO: {}", loginDTO);
        log.info("Username: {}", loginDTO.username());
        log.info("Password: {}", loginDTO.password() != null ? "***" : "NULL");
        log.info("Password length: {}", loginDTO.password() != null ? loginDTO.password().length() : "NULL");

        //  validation
        if (loginDTO.username() == null || loginDTO.username().trim().isEmpty()) {
            log.error("Username is null or empty");
            return ResponseEntity.badRequest().build();
        }
        if (loginDTO.password() == null || loginDTO.password().trim().isEmpty()) {
            log.error("Password is null or empty");
            return ResponseEntity.badRequest().build();
        }
        AuthResponse response = authService.authenticate(loginDTO);
        return ResponseEntity.ok(response);
    }
}