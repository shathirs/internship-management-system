package com.internship.backend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.internship.backend.dto.CreateProjectRequest;
import com.internship.backend.dto.ProjectResponse;
import com.internship.backend.dto.UpdateProjectRequest;
import com.internship.backend.model.Project;
import com.internship.backend.model.ProjectStatus;
import com.internship.backend.repository.InternRepository;
import com.internship.backend.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final InternRepository internRepository;

    public ProjectService(ProjectRepository projectRepository, InternRepository internRepository) {
        this.projectRepository = projectRepository;
        this.internRepository = internRepository;
    }

    public List<ProjectResponse> getAll(String search, String status) {
        List<Project> projects;

        if (search != null && !search.isBlank()) {
            String q = search.trim();
            projects = projectRepository
                    .findByNameContainingIgnoreCaseOrTechnologyContainingIgnoreCase(q, q);
        } else if (status != null && !status.isBlank()) {
            projects = projectRepository.findByStatus(
                    ProjectStatus.valueOf(status.trim().toUpperCase())
            );
        } else {
            projects = projectRepository.findAll();
        }

        if (status != null && !status.isBlank() && search != null && !search.isBlank()) {
            ProjectStatus st = ProjectStatus.valueOf(status.trim().toUpperCase());
            projects = projects.stream()
                    .filter(p -> p.getStatus() == st)
                    .collect(Collectors.toList());
        }

        return projects.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProjectResponse getById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        return toResponse(project);
    }

    public ProjectResponse create(CreateProjectRequest request) {
        validateInternIds(request.getAssignedInternIds());

        Instant now = Instant.now();
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setTechnology(request.getTechnology());
        project.setDeadline(request.getDeadline());
        project.setStatus(
                request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNED
        );
        project.setAssignedInternIds(
                request.getAssignedInternIds() != null
                        ? request.getAssignedInternIds()
                        : new ArrayList<>()
        );
        project.setCreatedAt(now);
        project.setUpdatedAt(now);

        project = projectRepository.save(project);
        return toResponse(project);
    }

    public ProjectResponse update(String id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        validateInternIds(request.getAssignedInternIds());

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setTechnology(request.getTechnology());
        project.setDeadline(request.getDeadline());
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        project.setAssignedInternIds(
                request.getAssignedInternIds() != null
                        ? request.getAssignedInternIds()
                        : new ArrayList<>()
        );
        project.setUpdatedAt(Instant.now());

        project = projectRepository.save(project);
        return toResponse(project);
    }

    public void delete(String id) {
        if (!projectRepository.existsById(id)) {
            throw new IllegalArgumentException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    private void validateInternIds(List<String> internIds) {
        if (internIds == null || internIds.isEmpty()) {
            return;
        }
        for (String internId : internIds) {
            if (!internRepository.existsById(internId)) {
                throw new IllegalArgumentException("Intern not found: " + internId);
            }
        }
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setTechnology(project.getTechnology());
        response.setDeadline(project.getDeadline());
        response.setStatus(project.getStatus());
        response.setAssignedInternIds(project.getAssignedInternIds());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        return response;
    }
}
