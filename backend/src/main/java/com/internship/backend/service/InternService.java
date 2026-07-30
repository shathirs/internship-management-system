package com.internship.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.internship.backend.dto.CreateInternRequest;
import com.internship.backend.dto.InternResponse;
import com.internship.backend.dto.UpdateInternRequest;
import com.internship.backend.model.Intern;
import com.internship.backend.model.InternStatus;
import com.internship.backend.model.Role;
import com.internship.backend.model.User;
import com.internship.backend.repository.InternRepository;
import com.internship.backend.repository.UserRepository;

@Service
public class InternService {

    private final InternRepository internRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public InternService(
            InternRepository internRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.internRepository = internRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<InternResponse> getAll(String search, String status, String department) {
        List<Intern> interns;

        if (search != null && !search.isBlank()) {
            String q = search.trim();
            interns = internRepository
                    .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrUniversityContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                            q, q, q, q
                    );
        } else if (status != null && !status.isBlank()) {
            interns = internRepository.findByStatus(InternStatus.valueOf(status.toUpperCase()));
        } else if (department != null && !department.isBlank()) {
            interns = internRepository.findByDepartmentIgnoreCase(department.trim());
        } else {
            interns = internRepository.findAll();
        }

        // Optional: apply extra filters on the list if both search + status used later
        if (status != null && !status.isBlank() && search != null && !search.isBlank()) {
            InternStatus st = InternStatus.valueOf(status.toUpperCase());
            interns = interns.stream()
                    .filter(i -> i.getStatus() == st)
                    .collect(Collectors.toList());
        }

        if (department != null && !department.isBlank() && (search != null && !search.isBlank() || status != null && !status.isBlank())) {
            String dept = department.trim();
            interns = interns.stream()
                    .filter(i -> i.getDepartment() != null && i.getDepartment().equalsIgnoreCase(dept))
                    .collect(Collectors.toList());
        }

        return interns.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InternResponse getById(String id) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Intern not found"));
        return toResponse(intern);
    }

    public InternResponse create(CreateInternRequest request) {
        if (internRepository.existsByEmail(request.getEmail()) || userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.INTERN
        );
        user = userRepository.save(user);

        Instant now = Instant.now();
        Intern intern = new Intern();
        intern.setUserId(user.getId());
        intern.setFullName(request.getFullName());
        intern.setEmail(request.getEmail());
        intern.setPhone(request.getPhone());
        intern.setUniversity(request.getUniversity());
        intern.setDepartment(request.getDepartment());
        intern.setBatch(request.getBatch());
        intern.setStartDate(request.getStartDate());
        intern.setEndDate(request.getEndDate());
        intern.setStatus(InternStatus.ACTIVE);
        intern.setCreatedAt(now);
        intern.setUpdatedAt(now);

        intern = internRepository.save(intern);
        return toResponse(intern);
    }

    public InternResponse update(String id, UpdateInternRequest request) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Intern not found"));

        if (!intern.getEmail().equalsIgnoreCase(request.getEmail())
                && (internRepository.existsByEmail(request.getEmail()) || userRepository.existsByEmail(request.getEmail()))) {
            throw new IllegalArgumentException("Email is already registered");
        }

        intern.setFullName(request.getFullName());
        intern.setEmail(request.getEmail());
        intern.setPhone(request.getPhone());
        intern.setUniversity(request.getUniversity());
        intern.setDepartment(request.getDepartment());
        intern.setBatch(request.getBatch());
        intern.setStartDate(request.getStartDate());
        intern.setEndDate(request.getEndDate());
        intern.setUpdatedAt(Instant.now());

        // Keep linked User name/email in sync
        if (intern.getUserId() != null) {
            userRepository.findById(intern.getUserId()).ifPresent(user -> {
                user.setName(request.getFullName());
                user.setEmail(request.getEmail());
                userRepository.save(user);
            });
        }

        intern = internRepository.save(intern);
        return toResponse(intern);
    }

    public void delete(String id) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Intern not found"));

        if (intern.getUserId() != null) {
            userRepository.deleteById(intern.getUserId());
        }
        internRepository.deleteById(id);
    }

    public InternResponse activate(String id) {
        return setStatus(id, InternStatus.ACTIVE);
    }

    public InternResponse deactivate(String id) {
        return setStatus(id, InternStatus.INACTIVE);
    }

    private InternResponse setStatus(String id, InternStatus status) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Intern not found"));
        intern.setStatus(status);
        intern.setUpdatedAt(Instant.now());
        intern = internRepository.save(intern);
        return toResponse(intern);
    }

    private InternResponse toResponse(Intern intern) {
        InternResponse response = new InternResponse();
        response.setId(intern.getId());
        response.setUserId(intern.getUserId());
        response.setFullName(intern.getFullName());
        response.setEmail(intern.getEmail());
        response.setPhone(intern.getPhone());
        response.setUniversity(intern.getUniversity());
        response.setDepartment(intern.getDepartment());
        response.setBatch(intern.getBatch());
        response.setStartDate(intern.getStartDate());
        response.setEndDate(intern.getEndDate());
        response.setStatus(intern.getStatus());
        response.setCreatedAt(intern.getCreatedAt());
        response.setUpdatedAt(intern.getUpdatedAt());
        return response;
    }
}