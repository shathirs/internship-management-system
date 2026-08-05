package com.internship.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTaskRequest {

    @NotBlank(message = "Assigned intern is required")
    private String assignedInternId;

    public String getAssignedInternId() { return assignedInternId; }
    public void setAssignedInternId(String assignedInternId) { this.assignedInternId = assignedInternId; }
}
