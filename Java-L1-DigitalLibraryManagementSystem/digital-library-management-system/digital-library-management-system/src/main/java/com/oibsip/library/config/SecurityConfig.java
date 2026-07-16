package com.oibsip.library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable Cross-Site Request Forgery (CSRF) since we are building a stateless REST API
                .csrf(csrf -> csrf.disable())

                // 2. Open up our authentication gateway endpoints to the public web
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Allows register and login without credentials
                        .anyRequest().authenticated()               // Keeps all other future endpoints securely locked
                );

        return http.build();
    }
}