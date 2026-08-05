package com.internship.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.internship.backend.model.Project;
import com.internship.backend.model.ProjectStatus;

public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByNameContainingIgnoreCaseOrTechnologyContainingIgnoreCase(
            String name,
            String technology
    );

    List<Project> findByAssignedInternIdsContaining(String internId);
}