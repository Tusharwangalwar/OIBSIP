package com.oibsip.library.repository;

import com.oibsip.library.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query method: Spring Boot automatically creates the SQL query behind the scenes!
    Optional<User> findByEmail(String email);
}