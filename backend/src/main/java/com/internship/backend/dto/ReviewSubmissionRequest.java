package com.internship.backend.dto;

import com.internship.backend.model.SubmissionStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReviewSubmissionRequest {

    @NotNull(message = "Status is required")
    private SubmissionStatus status;

    @NotBlank(message = "Admin comment is required")
    private String adminComment;

    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }
}
