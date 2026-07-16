package com.oibsip.library.controller;

import com.oibsip.library.dto.RegisterRequest;
import com.oibsip.library.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Dependency Injection via Constructor
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint: POST http://localhost:8080/api/auth/register
     * Handles new user signups with incoming DTO input validation
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            String responseMessage = authService.registerUser(request);
            return ResponseEntity.ok(responseMessage);
        } catch (RuntimeException e) {
            // Returns a 400 Bad Request error if user email is a duplicate
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint: POST http://localhost:8080/api/auth/login
     * Temporary placeholder login mapping for Day 3 verification
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginUser() {
        return ResponseEntity.ok("Login successful! JWT verification layer will hook up here on Day 4.");
    }
}
