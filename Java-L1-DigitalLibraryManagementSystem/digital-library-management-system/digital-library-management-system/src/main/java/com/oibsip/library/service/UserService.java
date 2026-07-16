package com.oibsip.library.service;

import com.oibsip.library.dto.RegisterRequest;
import com.oibsip.library.entity.User;
import com.oibsip.library.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // Dependency Injection via Constructor
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Handles registration business logic.
     * Throws a runtime exception if the email is already taken.
     */
    public String registerUser(RegisterRequest request) {
        // 1. Check if email already exists in our system
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        // 2. Create a new User Entity instance
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());

        // 3. For Day 3, we simulate hashing (we will link the actual BCrypt encoder component on Day 4)
        // This keeps it running cleanly before Spring Security configuration blocks our API endpoints
        String simulatedHash = "[BCRYPT_HASHEDED_]" + request.getPassword();
        newUser.setPassword(simulatedHash);

        newUser.setRole("USER");

        // 4. Commit to MySQL via JPA
        userRepository.save(newUser);

        return "User registered successfully!";
    }
}