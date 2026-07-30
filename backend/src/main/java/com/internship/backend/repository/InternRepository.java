package com.internship.backend.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.internship.backend.model.Intern;
import com.internship.backend.model.InternStatus;

public interface InternRepository extends MongoRepository<Intern, String> {

    Optional<Intern> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Intern> findByStatus(InternStatus status);

    List<Intern> findByDepartmentIgnoreCase(String department);

    List<Intern> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrUniversityContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String fullName,
            String email,
            String university,
            String department
    );
}