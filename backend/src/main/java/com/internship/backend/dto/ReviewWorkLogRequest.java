package com.internship.backend.dto;

import com.internship.backend.model.WorkLogStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReviewWorkLogRequest {

    @NotNull(message = "Status is required")
    private WorkLogStatus status;

    @NotBlank(message = "Admin comment is required")
    private String adminComment;

    public WorkLogStatus getStatus() { return status; }
    public void setStatus(WorkLogStatus status) { this.status = status; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }
}
