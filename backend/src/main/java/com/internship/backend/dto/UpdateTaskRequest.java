package com.internship.backend.dto;

import com.internship.backend.model.TaskPriority;
import com.internship.backend.model.TaskStatus;

import jakarta.validation.constraints.NotBlank;

public class UpdateTaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private TaskPriority priority;

    private TaskStatus status;

    @NotBlank(message = "Deadline is required")
    private String deadline;

    private String assignedInternId;

    @NotBlank(message = "Project is required")
    private String projectId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getAssignedInternId() { return assignedInternId; }
    public void setAssignedInternId(String assignedInternId) { this.assignedInternId = assignedInternId; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
}
