package com.internship.backend.dto;

import java.time.Instant;
import java.util.List;

import com.internship.backend.model.ProjectStatus;

public class ProjectResponse {

    private String id;
    private String name;
    private String description;
    private String technology;
    private String deadline;
    private ProjectStatus status;
    private List<String> assignedInternIds;
    private Instant createdAt;
    private Instant updatedAt;

    public ProjectResponse() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public List<String> getAssignedInternIds() { return assignedInternIds; }
    public void setAssignedInternIds(List<String> assignedInternIds) {
        this.assignedInternIds = assignedInternIds;
    }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}