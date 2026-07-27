package com.oibsip.library.service;

import com.oibsip.library.dto.LoginRequest;
import com.oibsip.library.dto.LoginResponse;
import com.oibsip.library.dto.RegisterRequest;
import com.oibsip.library.entity.User;
import com.oibsip.library.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // 👈 2. Updated constructor to inject JwtService
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);
        return "User registered successfully!";
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password credentials");
        }

        // 👈 3. Generate JWT Token
        String token = jwtService.generateToken(user.getEmail());

        // 👈 4. Pass token into LoginResponse
        return new LoginResponse(
                "Login Successful!",
                user.getEmail(),
                user.getRole() != null ? user.getRole() : "USER",
                token
        );
    }
}