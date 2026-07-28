package com.internship.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.internship.backend.dto.AuthResponse;
import com.internship.backend.dto.LoginRequest;
import com.internship.backend.dto.RegisterRequest;
import com.internship.backend.model.Role;
import com.internship.backend.model.User;
import com.internship.backend.repository.UserRepository;
import com.internship.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Policy B: public register is INTERN only
        Role role = Role.INTERN;

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole());
    }
}