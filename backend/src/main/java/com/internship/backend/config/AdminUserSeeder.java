package com.internship.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.internship.backend.model.Role;
import com.internship.backend.model.User;
import com.internship.backend.repository.UserRepository;

@Component
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin.name}")
    private String adminName;

    @Value("${app.seed.admin.email}")
    private String adminEmail;

    @Value("${app.seed.admin.password}")
    private String adminPassword;

    public AdminUserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByRole(Role.ADMIN)) {
            return;
        }

        User admin = new User(
                adminName,
                adminEmail,
                passwordEncoder.encode(adminPassword),
                Role.ADMIN
        );

        userRepository.save(admin);
        System.out.println("Seeded default ADMIN user: " + adminEmail);
    }
}