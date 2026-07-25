package com.oibsip.library.service;

import com.oibsip.library.dto.LoginRequest;
import com.oibsip.library.dto.LoginResponse;
import com.oibsip.library.dto.RegisterRequest;
import com.oibsip.library.entity.User;
import com.oibsip.library.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService { // Or AuthService

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Your Existing Registration Logic
    public String registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Encode password using BCrypt before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER"); // Default role

        userRepository.save(user);
        return "User registered successfully!";
    }

    // 2. New Login Logic
    public LoginResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        // Compare plain text password input with BCrypt hash in database
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password credentials");
        }

        // Return successful login token bundle
        return new LoginResponse(
                "Login Successful!",
                user.getEmail(),
                user.getRole() != null ? user.getRole() : "USER"
        );
    }
}