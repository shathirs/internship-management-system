package com.internship.backend.dto;

import java.util.List;

import com.internship.backend.model.ProjectStatus;

import jakarta.validation.constraints.NotBlank;

public class CreateProjectRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotBlank(message = "Technology is required")
    private String technology;

    @NotBlank(message = "Deadline is required")
    private String deadline;

    private ProjectStatus status;

    private List<String> assignedInternIds;

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
}