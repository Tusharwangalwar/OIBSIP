package com.oibsip.library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF to allow Postman POST requests without tokens
                .csrf(csrf -> csrf.disable())

                // 2. Disable Frame Options
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // 3. Configure HTTP Request Authorizations
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Allows /api/auth/register and /api/auth/login
                        .anyRequest().authenticated()
                );

        return http.build();
    }
} // <--- This closing brace was missing!