package com.oibsip.library.dto;

public class LoginResponse {
    private String message;
    private String email;
    private String role;
    private String token; // 👈 New field

    // Default constructor
    public LoginResponse() {}

    // Constructor with all fields
    public LoginResponse(String message, String email, String role, String token) {
        this.message = message;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}