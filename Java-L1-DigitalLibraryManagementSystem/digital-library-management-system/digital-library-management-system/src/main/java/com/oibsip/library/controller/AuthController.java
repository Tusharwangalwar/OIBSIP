package com.oibsip.library.controller;

import com.oibsip.library.dto.LoginRequest;
import com.oibsip.library.dto.LoginResponse;
import com.oibsip.library.dto.RegisterRequest;
import com.oibsip.library.service.UserService; // Adjust to AuthService if you kept that name
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService; // Adjust to AuthService if needed

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        String response = userService.registerUser(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}